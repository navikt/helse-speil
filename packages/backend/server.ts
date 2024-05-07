import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import httpProxy from 'http-proxy';
import * as http from 'node:http';
import { Client, generators } from 'openid-client';
import util from 'util';

import auth from './auth/authSupport';
import azure from './auth/azure';
import config from './config';
import flexjarRoutes from './flexjar/flexjarRoutes';
import graphQLRoutes from './graphql/graphQLRoutes';
import headers from './headers';
import logger from './logging';
import modiaRoutes from './modia/modiaRoutes';
import { ipAddressFromRequest } from './requestData';
import { AuthError, SpeilRequest } from './types';
import wiring from './wiring';

const app = express();
const port = config.server.port;
const helsesjekk = { redis: false };
const dependencies = wiring.getDependencies(app, helsesjekk);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(dependencies.sessionStore);
app.use(compression());

headers.setup(app);

let azureClient: Client | null = null;
azure
    .setup(config.oidc)
    .then((client: Client) => {
        azureClient = client;
    })
    .catch((err) => {
        logger.error(`Failed to discover OIDC provider properties: ${err}`);
        process.exit(1);
    });

// Unprotected routes
app.get('/isAlive', (_, res) => res.send('alive'));
app.get('/isReady', (_, res) => {
    if (helsesjekk.redis) {
        return res.send('ready');
    } else {
        logger.warn('Svarer not ready på isReady');
        res.statusCode = 503;
        return res.send('NOT READY');
    }
});

const setUpAuthentication = () => {
    const authErrorCounter = dependencies.instrumentation.authError();
    app.get('/login', (req: SpeilRequest, res: Response) => {
        const session = req.session;
        session.nonce = generators.nonce();
        session.state = generators.state();
        const url = azureClient!.authorizationUrl({
            scope: config.oidc.scope,
            redirect_uri: auth.redirectUrl(req),
            response_type: config.oidc.responseType[0],
            prompt: 'select_account',
            response_mode: 'form_post',
            nonce: session.nonce,
            state: session.state,
        });
        res.redirect(url);
    });
    app.get('/logout', (req: SpeilRequest, res: Response) => {
        azureClient!
            .revoke(req.session.speilToken)
            .catch(() => logger.warn('Kunne ikke invalidere token mot Azure AD'))
            .finally(() => {
                req.session.destroy(() => {});
                res.clearCookie('speil');
                res.redirect(302, config.oidc.logoutUrl);
            });
    });

    app.use(bodyParser.urlencoded({ extended: false }));

    app.post('/oauth2/callback', (req: SpeilRequest, res: Response) => {
        const session = req.session;
        auth.validateOidcCallback(req, azureClient!)
            .then((tokens: string[]) => {
                const [accessToken, idToken, refreshToken] = tokens;
                res.cookie('speil', `${idToken}`, {
                    secure: true,
                    sameSite: true,
                });
                session.speilToken = accessToken;
                session.refreshToken = refreshToken;
                session.oboTokens = {};
                session.user = auth.valueFromClaim('NAVident', idToken);
                const tilbakeTilUrl = req.session.wantedPathBeforeAuth;
                req.session.wantedPathBeforeAuth = undefined;
                if (tilbakeTilUrl) logger.sikker.info(`sender bruker tilbake til ${tilbakeTilUrl}`);
                res.redirect(303, tilbakeTilUrl ?? '/');
            })
            .catch((err: AuthError) => {
                logger.warn(`Error caught during login: ${err.message} (se sikkerLog for detaljer)`);
                logger.sikker.warn(
                    `Error caught during login: ${err.message}, cause ${err.cause}.` +
                        `The request received: ${util.inspect(req)}`,
                    err,
                );
                authErrorCounter.inc();
                session.destroy((err) => {
                    if (err) {
                        return logger.sikker.warn(`Feil oppsto ifm sletting av sesjon: ${err}.`);
                    }
                });
                res.clearCookie('speil');
                res.redirect('/login');
            });
    });
};

setUpAuthentication();

// Protected routes
app.use('/*', async (req: SpeilRequest, res, next) => {
    if (config.development) {
        res.cookie('speil', auth.createTokenForTest(), {
            secure: false,
            sameSite: true,
        });
        req.session.user = 'dev-ident';
        next();
    } else {
        if (
            auth.isValidIn({ seconds: 5, token: req.session!.speilToken }) ||
            (await auth.refreshAccessToken(azureClient!, req.session!))
        ) {
            next();
        } else {
            if (req.session!.speilToken) {
                const name: string = auth.valueFromClaim('name', req.session!.speilToken);
                logger.info(`No valid session found for ${name}, connecting via ${ipAddressFromRequest(req)}`);
                logger.sikker.info(
                    `No valid session found for ${name}, connecting via ${ipAddressFromRequest(req)}`,
                    logger.requestMeta(req),
                );
            }
            if (req.originalUrl === '/' || req.originalUrl.startsWith('/static')) {
                const user = req.session.user;
                req.session.destroy(() => logger.info(`Sesjonen for '${user}' er slettet ifm redirect til /login.`));
                res.redirect('/login');
            } else {
                const url = req.originalUrl;
                if (req.accepts('html') && url.includes('/person/')) {
                    req.session.wantedPathBeforeAuth = url;
                    logger.sikker.info(`Bruker vil til ${url}, tar vare på den URL-en til etter innlogging`);
                    res.redirect('/login');
                } else {
                    // these are not _that_ important, let the client decide how to handle
                    res.clearCookie('speil');
                    res.sendStatus(401);
                }
            }
        }
    }
});

app.use('/graphql', graphQLRoutes(dependencies.graphql));
app.use('/flexjar', flexjarRoutes(dependencies.flexjar));
app.use('/settModiaContext', modiaRoutes(dependencies.modia));

app.get('/*', (req, res, next) => {
    if (!req.accepts('html') && /\/api/.test(req.url)) {
        logger.debug(`Received a non-HTML request for '${req.url}', which didn't match a route`);
        res.sendStatus(404);
        return;
    }
    next();
});

const clientPath = config.development ? '../../dist/client' : '/app/dist/client';

// At the time of writing this comment, the setup of the static 'routes' has to be done in a particular order.
app.use('/favicons', express.static(`${clientPath}/favicons`));
app.use('/static', express.static(`${clientPath}/static`));
app.use('/*', express.static(`${clientPath}/index.html`));
app.use('/', express.static(`${clientPath}/`));

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }
    logger.error(`Noe gikk veldig galt:`, err);
    res.status(500).send({
        message: 'En feil oppstod',
        details: err.message,
    });
};
app.use(errorHandler);

const server = http.createServer(app);

const wsProxy = httpProxy.createProxy({
    target: config.server.spesialistWsUrl,
    ws: true,
    secure: true,
    changeOrigin: true,
});
server.on('connection', () => {
    logger.debug(`connection attempt`);
});
server.on('upgrade', function (req, socket, head) {
    logger.debug(`upgrade received`);
    wsProxy.ws(req, socket, head);
});
wsProxy.on('error', (error: NodeJS.ErrnoException, _req, res: Response) => {
    if (error.code !== 'ECONNRESET') {
        logger.error(`proxy error: ${JSON.stringify(error)}`);
    }
    if (!res.headersSent) {
        res.writeHead(500, { 'content-type': 'application/json' });
    }
    res.end(JSON.stringify({ error: 'proxy_error', reason: error.message }));
});

server.listen(port, () =>
    logger.info(
        `Speil backend listening on port ${port}. Will connect to spesialist on ${config.server.spesialistBaseUrl}`,
    ),
);

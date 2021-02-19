import express, { Response } from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { Client, generators } from 'openid-client';

import config from './config';
import wiring from './wiring';
import logger from './logging';
import headers from './headers';
import { sessionStore } from './sessionStore';
import { ipAddressFromRequest } from './requestData';

import azure from './auth/azure';
import auth from './auth/authSupport';

import person from './person/personRoutes';
import paymentRoutes from './payment/paymentRoutes';
import overstyringRoutes from './overstyring/overstyringRoutes';
import tildelingRoutes from './tildeling/tildelingRoutes';
import { SpeilRequest } from './types';
import dummyRoutes from './dummy/dummyRoutes';
import opptegnelseRoutes from './opptegnelse/opptegnelseRoutes';
import oppgaveRoutes from './oppgave/oppgaveRoutes';

const app = express();
const port = config.server.port;
const helsesjekk: Helsesjekk = { redis: false };
const dependencies = wiring.getDependencies(app, helsesjekk);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(sessionStore(config, dependencies.redisClient));
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
        console.log('Svarer not ready på isReady');
        res.statusCode = 503;
        return res.send('NOT READY');
    }
});

const setUpAuthentication = () => {
    app.get('/login', (req: SpeilRequest, res: Response) => {
        const session = req.session;
        session.nonce = generators.nonce();
        session.state = generators.state();
        const url = azureClient!.authorizationUrl({
            scope: config.oidc.scope,
            redirect_uri: auth.redirectUrl(req, config.oidc),
            response_type: config.oidc.responseType[0],
            prompt: 'select_account',
            response_mode: 'form_post',
            nonce: session.nonce,
            state: session.state,
        });
        res.redirect(url);
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.post('/callback', (req: SpeilRequest, res: Response) => {
        const session = req.session;
        auth.validateOidcCallback(req, azureClient!, config.oidc)
            .then((tokens: string[]) => {
                const [accessToken, idToken, refreshToken] = tokens;
                res.cookie('speil', `${idToken}`, {
                    secure: true,
                    sameSite: true,
                });
                session.speilToken = accessToken;
                session.refreshToken = refreshToken;
                session.user = auth.valueFromClaim('NAVident', idToken);
                res.redirect(303, '/');
            })
            .catch((err: Error) => {
                logger.error(err.message, err);
                session.destroy(() => {});
                res.sendStatus(403);
            });
    });
};

setUpAuthentication();

// Protected routes
app.use('/*', async (req: SpeilRequest, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        res.cookie('speil', auth.createTokenForTest(), {
            secure: false,
            sameSite: true,
        });
        next();
    } else {
        if (
            auth.isValidIn({ seconds: 5, token: req.session!.speilToken }) ||
            (await auth.refreshAccessToken(azureClient!, req.session!))
        ) {
            const url = req?.originalUrl?.split('/') ?? [];
            logger.audit(`Someone is making request to ${url.slice(0, url.length - 1).join()}`);

            res.cookie('spesialist', req.session.speilToken, { secure: true, sameSite: true });
            next();
        } else {
            if (req.session!.speilToken) {
                const name = auth.valueFromClaim('name', req.session!.speilToken);
                logger.info(`No valid session found for ${name}, connecting via ${ipAddressFromRequest(req)}`);
            }
            if (req.originalUrl === '/' || req.originalUrl.startsWith('/static')) {
                res.redirect('/login');
            } else {
                // these are xhr's, let the client decide how to handle
                res.clearCookie('speil');
                res.sendStatus(401);
            }
        }
    }
});

app.use('/api/person', person.setup({ ...dependencies.person }));
app.use('/api/payments', paymentRoutes(dependencies.payments));
app.use('/api/overstyring', overstyringRoutes(dependencies.overstyring));
app.use('/api/tildeling', tildelingRoutes(dependencies.tildeling));
app.use('/api/dummy', dummyRoutes(dependencies.dummy));
app.use('/api/opptegnelse', opptegnelseRoutes(dependencies.opptegnelse));
app.use('/api/oppgave', oppgaveRoutes(dependencies.oppgave));

app.get('/*', (req, res, next) => {
    if (!req.accepts('html') && /\/api/.test(req.url)) {
        console.debug(`Received a non-HTML request for '${req.url}', which didn't match a route`);
        res.sendStatus(404);
        return;
    }
    next();
});

// At the time of writing this comment, the setup of the static 'routes' has to be done in a particular order.
app.use('/static', express.static('dist/client'));
app.use('/*', express.static('dist/client/index.html'));
app.use('/', express.static('dist/client/'));

app.listen(port, () => logger.info(`Speil backend listening on port ${port}`));

import express, { Request, Response } from 'express';
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
import stsclient from './auth/stsClient';

import person from './person/personRoutes';
import payments from './payment/paymentRoutes';
import tildeling from './tildeling/tildelingRoutes';
import { OidcConfig } from './types';

const app = express();
const port = config.server.port;
const dependencies = wiring.getDependencies(app);

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
    .catch(err => {
        logger.error(`Failed to discover OIDC provider properties: ${err}`);
        process.exit(1);
    });

stsclient.init(config.nav);

// Unprotected routes
app.get('/isAlive', (req, res) => res.send('alive'));
app.get('/isReady', (req, res) => res.send('ready'));

const redirectUrl = (req: Request, oidc: OidcConfig) => {
    const hostHeader = req.get('Host');
    if (hostHeader?.startsWith('localhost')) {
        return 'http://' + hostHeader + '/callback';
    } else {
        return oidc.redirectUrl;
    }
};

const setUpAuthentication = () => {
    app.get('/login', (req: Request, res: Response) => {
        req.session!.nonce = generators.nonce();
        req.session!.state = generators.state();
        const url = azureClient!.authorizationUrl({
            scope: config.oidc.scope,
            redirect_uri: redirectUrl(req, config.oidc),
            response_type: config.oidc.responseType[0],
            response_mode: 'form_post',
            nonce: req.session!.nonce,
            state: req.session!.state
        });
        res.redirect(url);
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.post('/callback', (req, res) => {
        auth.validateOidcCallback(req, azureClient!, config.oidc)
            .then((tokens: string[]) => {
                const [accessToken, idToken] = tokens;
                res.cookie('speil', `${idToken}`, {
                    secure: true,
                    sameSite: true
                });
                req.session!.speilToken = accessToken;
                req.session!.user = auth.valueFromClaim('NAVident', idToken);
                res.redirect('/');
            })
            .catch((err: Error) => {
                logger.error(err.message, err);
                req.session!.destroy(() => {});
                res.sendStatus(403);
            });
    });
};

setUpAuthentication();

// Protected routes
app.use('/*', (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        res.cookie('speil', auth.createTokenForTest(), {
            secure: false,
            sameSite: true
        });
        next();
    } else {
        if (auth.isValidNow(req.session!.speilToken)) {
            next();
        } else {
            logger.info(
                `no valid session found for ${ipAddressFromRequest(
                    req
                )}, username ${auth.valueFromClaim('name', req.session!.speilToken)}`
            );
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

app.use('/api/tildeling', tildeling.setup(dependencies.redisClient));
app.use('/api/person', person.setup(dependencies.person));
app.use('/api/payments', payments.setup(dependencies.payments));

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

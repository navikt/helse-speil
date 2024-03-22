import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';

import { getToken, validateAzureToken } from '@navikt/oasis';

import { getLoggedInUserInfo } from './auth/userInfo';
import config from './config';
import flexjarRoutes from './flexjar/flexjarRoutes';
import graphQLRoutes from './graphql/graphQLRoutes';
import headers from './headers';
import logger from './logging';
import wiring from './wiring';

const app = express();
const port = config.server.port;
const dependencies = wiring.getDependencies(app);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());

headers.setup(app);

// Unprotected routes
app.get('/isAlive', (_, res) => res.send('alive'));
app.get('/isReady', (_, res) => res.send('ready'));

// Protected routes
app.use('/*', async (req, res, next) => {
    if (config.development) {
        next();
    } else {
        const token = getToken(req);
        if (!token) {
            if (req.originalUrl === '/' || req.originalUrl.startsWith('/static')) {
                res.redirect('/oauth2/login?redirect=/');
                return;
            }

            const url = req.originalUrl;
            if (req.accepts('html') && url.includes('/person/')) {
                res.redirect(`/oauth2/login?redirect=${url}`);
                return;
            }

            res.sendStatus(401);
            return;
        }

        const validationResult = await validateAzureToken(token);
        if (validationResult.ok) {
            next();
        } else {
            logger.info(`Token validation failed: ${validationResult.error}`);
            res.sendStatus(401);
        }
    }
});

app.use('/graphql', graphQLRoutes(dependencies.graphql));
app.use('/flexjar', flexjarRoutes(dependencies.flexjar));
app.get('/user', getLoggedInUserInfo);

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

app.listen(port, () =>
    logger.info(
        `Speil backend listening on port ${port}. Will connect to spesialist on ${config.server.spesialistBaseUrl}`,
    ),
);

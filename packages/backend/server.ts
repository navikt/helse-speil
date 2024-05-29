import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as http from 'node:http';

import { getToken, validateToken } from '@navikt/oasis';

import { createTokenForTest } from './auth/testToken';
import config from './config';
import flexjarRoutes from './flexjar/flexjarRoutes';
import graphQLRoutes from './graphql/graphQLRoutes';
import headers from './headers';
import logger from './logging';
import modiaRoutes from './modia/modiaRoutes';
import { ipAddressFromRequest } from './requestData';
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
app.use('/*', async (req: Request, res, next) => {
    if (config.development) {
        res.cookie('speil', createTokenForTest(), {
            secure: false,
            sameSite: true,
        });

        next();
    } else {
        const token = getToken(req);
        if (!token) {
            logger.info(`No valid session found for user, connecting via ${ipAddressFromRequest(req)}`);
            logger.sikker.info(
                `No valid session found for user, connecting via ${ipAddressFromRequest(req)}`,
                logger.requestMeta(req),
            );

            if (req.accepts('html')) {
                const url = new URL(req.originalUrl);
                res.redirect(`/oauth2/login?redirect=${url.pathname}`);
                return;
            } else {
                res.sendStatus(401);
                return;
            }
        }

        const validation = await validateToken(token);
        if (!validation.ok) {
            if (validation.errorType === 'token expired') {
                const url = new URL(req.originalUrl);
                res.redirect(`/oauth2/login?redirect=${url.pathname}`);
                return;
            }

            logger.info(`Token validering feilet: ${validation.errorType}`);
            res.sendStatus(401);
        }

        next();
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

// const wsProxy = httpProxy.createProxy({
//     target: config.server.spesialistWsUrl,
//     changeOrigin: true,
//     ws: true,
//     secure: true, // kommunikasjonen til spesialist foregår internt i clusteret
// });

const proxy = createProxyMiddleware({
    target: config.server.spesialistWsUrl,
    ws: true,
    pathFilter: '/ws',
});

app.use(proxy);
// const hentOboToken = async (req: SpeilRequest) =>
//     await dependencies.onBehalfOf.hentFor(config.oidc.clientIDSpesialist, req.session, req.session.speilToken);

server.on('upgrade', proxy.upgrade);

// server.on('upgrade', async (req: http.IncomingMessage, socket, head) => {
//     logger.debug(`upgrade received: ${req.url}`);
//     logger.debug(req.url!);
//     try {
//         // dependencies.sessionStore(req as Request, {} as Response, async () => {
//         //     const speilReq = req as SpeilRequest;
//         //     logger.debug(`req.session: ${speilReq.session}`);
//         //     logger.debug(`req.session.user: ${speilReq.session.user}`);
//         //     const oboToken = await hentOboToken(speilReq);
//         //     wsProxy.ws(
//         //         req,
//         //         socket,
//         //         head,
//         //         {
//         //             headers: {
//         //                 Authorization: `Bearer ${oboToken}`,
//         //             },
//         //         },
//         //         (err, req, res, target) =>
//         //             logger.sikker.info(
//         //                 `Feil ifm. WS-tilkobling: ${err}.\nreq: ${req}, response: ${res}, target: ${target}`,
//         //             ),
//         //     );
//         // });
//         wsProxy.ws(req, socket, head);
//         logger.debug(`sessionStore called`);
//     } catch (e) {
//         logger.sikker.info(`Feil ifm. WS-tilkobling: ${e}`);
//         return;
//     }
// });
// wsProxy.on('error', (error: NodeJS.ErrnoException, _req, res: Response) => {
//     if (error.code !== 'ECONNRESET') {
//         logger.error(`proxy error: ${JSON.stringify(error)}`);
//     }
//
//     res.end(JSON.stringify({ error: 'proxy_error', reason: error.message }));
// });

server.listen(port, () =>
    logger.info(
        `Speil backend listening on port ${port}. Will connect to spesialist on ${config.server.spesialistBaseUrl}`,
    ),
);

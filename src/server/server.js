'use strict';

const config = require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const { generators } = require('openid-client');

const azure = require('./auth/azure');
const authsupport = require('./auth/authsupport');
const stsclient = require('./auth/stsclient');
const { sessionStore } = require('./sessionstore');

const metrics = require('./metrics');
const headers = require('./headers');

const behandlinger = require('./behandlinger/behandlingerroutes');
const feedback = require('./feedback/feedbackroutes');
const person = require('./person/personroutes');

const { ipAddressFromRequest } = require('./requestData');
const { nameFrom } = require('./auth/authsupport');
const { log } = require('./logging');

const app = express();
const port = config.server.port;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(sessionStore(config));
app.use(compression());

headers.setup(app);
metrics.setup(app);

let azureClient = null;
azure
    .setup(config.oidc)
    .then(client => {
        azureClient = client;
    })
    .catch(err => {
        log(`Failed to discover OIDC provider properties: ${err}`);
        process.exit(1);
    });

stsclient.init(config.nav);

// Unprotected routes
app.get('/isAlive', (req, res) => res.send('alive'));
app.get('/isReady', (req, res) => res.send('ready'));

app.get('/login', (req, res) => {
    req.session.nonce = generators.nonce();
    const url = azureClient.authorizationUrl({
        scope: config.oidc.scope,
        redirect_uri: config.oidc.redirectUrl,
        response_type: config.oidc.responseType,
        response_mode: 'form_post',
        nonce: req.session.nonce
    });
    res.redirect(url);
});

app.post('/callback', (req, res) => {
    authsupport
        .validateOidcCallback(req, azureClient, config.oidc)
        .then(tokens => {
            const [accessToken, idToken] = tokens;
            res.cookie('speil', `${idToken}`, {
                secure: process.env.NODE_ENV !== 'development',
                sameSite: true
            });
            req.session.spadeToken = accessToken;
            res.redirect('/');
        })
        .catch(err => {
            log(err);
            req.session.destroy();
            res.sendStatus(403);
        });
});

// Protected routes
app.use('/*', (req, res, next) => {
    if (process.env.NODE_ENV === 'development' || authsupport.isValidNow(req.session.spadeToken)) {
        next();
    } else {
        log(
            `no valid session found for ${ipAddressFromRequest(req)}, username ${nameFrom(
                req.session.spadeToken
            )}`
        );
        if (req.originalUrl === '/' || req.originalUrl.startsWith('/static')) {
            res.redirect('/login');
        } else {
            // these are xhr's, let the client decide how to handle
            res.clearCookie('speil');
            res.sendStatus(401);
        }
    }
});

app.use('/static', express.static('dist/client'));

behandlinger.setup(app);

feedback
    .setup(app, config.s3)
    .then(() => {
        log(`Feedback storage at ${config.s3.s3url}`);
    })
    .catch(err => {
        log(
            `Failed to setup feedback storage: ${err}. Routes for storing and retrieving feedback are not available.`
        );
    });

person.setup(app, stsclient);

app.get('/', (_, res) => {
    res.redirect('/static');
});

app.listen(port, () => log(`Speil backend listening on port ${port}`));

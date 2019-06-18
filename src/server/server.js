'use strict';

const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Issuer } = require('openid-client');
const { generators } = require('openid-client');
const { custom } = require('openid-client');
const request = require('request');
const fs = require('fs');

const config = require('./config');
const tokendecoder = require('./tokendecoder');
const proxy = require('./proxy');
const metrics = require('./metrics');
const headers = require('./headers');

const mapping = require('./mapping');

const app = express();
const port = config.server.port;

const behandlingerFor = (aktorId, accessToken, callback) => {
    request.get(
        `http://spade.default.svc.nais.local/api/behandlinger/${aktorId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        },
        (error, response, body) => {
            const erred = error || response.statusCode !== 200;
            if (erred) {
                console.log(
                    `Error during lookup, got ${response.statusCode} ${error ||
                        'unknown error'} fom spade`
                );
            }

            callback({
                status: response.statusCode,
                data: erred ? error : body
            });
        }
    );
};

const proxyAgent = proxy.setup(Issuer, custom);

let azureClient = null;
Issuer.discover(config.oidc.identityMetadata)
    .then(azure => {
        console.log(`Discovered issuer ${azure.issuer}`);
        azureClient = new azure.Client({
            client_id: config.oidc.clientID,
            client_secret: config.oidc.clientSecret,
            redirect_uris: config.oidc.redirectUrl,
            response_types: config.oidc.responseType
        });

        if (proxyAgent) {
            azure[custom.http_options] = function(options) {
                options.agent = proxyAgent;
                return options;
            };
            azureClient[custom.http_options] = function(options) {
                options.agent = proxyAgent;
                return options;
            };
        }
    })
    .catch(err => {
        console.log(`Failed to discover OIDC provider properties: ${err}`);
        process.exit(1);
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({ secret: config.server.sessionSecret }));
app.use('/static', express.static('dist'));

headers.setup(app);
metrics.setup(app);

if (process.env.NODE_ENV === 'development') {
    app.use('/mock-data', express.static('__mock-data__'));
}

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
    const params = azureClient.callbackParams(req);
    const nonce = req.session.nonce;
    azureClient
        .callback(config.oidc.redirectUrl, params, { nonce })
        .then(tokenSet => {
            res.cookie('speil', `${tokenSet['id_token']}`, {
                httpOnly: true,
                secure: true
            });
            req.session.spadeToken = tokenSet['access_token'];
            res.redirect('/');
        })
        .catch(err => {
            console.log(`error in oidc callback: ${err}`);
            req.session.destroy();
            res.sendStatus(403);
        });
});

app.get('/whoami', (req, res) => {
    if (process.env.NODE_ENV === 'development') {
        res.send({ name: `Sara Saksbehandler` });
    } else if (req.cookies['speil']) {
        res.send({ name: `${tokendecoder.username(req.cookies['speil'])}` });
    } else {
        res.sendStatus(401);
    }
});

app.get('/behandlinger/:aktorId', (req, res) => {
    if (process.env.NODE_ENV === 'development') {
        fs.readFile('__mock-data__/behandlinger.json', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            res.header('Content-type', 'application/json; charset=utf-8');
            res.send(
                JSON.parse(data).behandlinger.map(behandling =>
                    mapping.alle(behandling)
                )
            );
        });
        return;
    }
    const accessToken = req.session.spadeToken;
    if (!accessToken) {
        res.sendStatus(403);
    } else {
        const aktorId = req.params.aktorId;
        behandlingerFor(aktorId, accessToken, behandlinger => {
            if (behandlinger.status !== 200) {
                const mapped = behandlinger.data.map(behandling =>
                    mapping.alle(behandling)
                );
                res.status(behandlinger.status).send(mapped);
            } else {
                res.send(
                    mapping.alle(behandlinger.data) || 'Fant ingen behandlinger'
                );
            }
        });
    }
});

app.get('/', (_, res) => {
    res.redirect('/static');
});

app.listen(port, () => console.log(`Speil backend listening on port ${port}`));

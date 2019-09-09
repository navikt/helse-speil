'use strict';

const { Issuer, custom } = require('openid-client');
const proxy = require('./proxy');

let azureClient = null;
const proxyAgent = proxy.setup(Issuer, custom);

const setup = config => {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'development') {
            resolve();
        }

        Issuer.discover(config.identityMetadata)
            .then(azure => {
                console.log(`Discovered issuer ${azure.issuer}`);
                azureClient = new azure.Client({
                    client_id: config.clientID,
                    client_secret: config.clientSecret,
                    redirect_uris: config.redirectUrl,
                    response_types: config.responseType
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

                resolve(azureClient);
            })
            .catch(err => {
                reject(err);
            });
    });
};

module.exports = {
    setup: setup
};

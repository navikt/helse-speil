import { Client, custom, Issuer } from 'openid-client';

import logger from '../logging';
import { OidcConfig } from '../types';
import { setup as proxy } from './proxy';

('use strict');

let azureClient;
const proxyAgent = proxy(Issuer, custom);

const setup = (config: OidcConfig) => {
    return new Promise<void | Client>((resolve, reject) => {
        if (process.env.NODE_ENV === 'development') {
            resolve();
        }

        Issuer.discover(config.wellKnownEndpoint)
            .then((azure) => {
                logger.info(`Discovered issuer ${azure.issuer}`);
                azureClient = new azure.Client({
                    client_id: config.clientID,
                    client_secret: config.clientSecret,
                    redirect_uris: [],
                    response_types: ['code'],
                    revocation_endpoint: azure.metadata.revocation_endpoint,
                });

                if (proxyAgent) {
                    azure[custom.http_options] = function (options) {
                        options.agent = proxyAgent;
                        return options;
                    };
                    azureClient[custom.http_options] = function (options) {
                        options.agent = proxyAgent;
                        return options;
                    };
                }

                resolve(azureClient);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export default { setup };

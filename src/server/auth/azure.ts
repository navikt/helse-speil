'use strict';

import { custom, Issuer } from 'openid-client';
import { OidcConfig } from '../types';
import logger from '../logging';
import proxy from './proxy';

let azureClient;
const proxyAgent = proxy.setup(Issuer, custom);

const setup = (config: OidcConfig) => {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'development') {
            resolve();
        }

        Issuer.discover(`${config.providerBaseUrl}/v2.0/.well-known/openid-configuration`)
            .then((azure) => {
                logger.info(`Discovered issuer ${azure.issuer}`);
                azureClient = new azure.Client({
                    client_id: config.clientID,
                    client_secret: config.clientSecret,
                    redirect_uris: [config.redirectUrl, 'http://localhost:3000'],
                    response_types: ['code', 'id_token'],
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

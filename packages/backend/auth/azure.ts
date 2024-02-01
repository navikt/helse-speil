import { Client, Issuer } from 'openid-client';

import logger from '../logging';
import { OidcConfig } from '../types';

('use strict');

let azureClient;

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
                    end_session_endpoint: azure.metadata.end_session_endpoint,
                });

                resolve(azureClient);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export default { setup };

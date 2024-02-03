import { Client, Issuer } from 'openid-client';

import config from '../config';
import logger from '../logging';
import { OidcConfig } from '../types';

('use strict');

let azureClient;

const setup = (oidcConfig: OidcConfig) => {
    return new Promise<void | Client>((resolve, reject) => {
        if (config.development) {
            resolve();
        }

        Issuer.discover(oidcConfig.wellKnownEndpoint)
            .then((azure) => {
                logger.info(`Discovered issuer ${azure.issuer}`);
                azureClient = new azure.Client({
                    client_id: oidcConfig.clientID,
                    client_secret: oidcConfig.clientSecret,
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

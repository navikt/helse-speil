import request from 'request-promise-native';
import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import logger from '../logging';
import { OidcConfig, OnBehalfOf } from '../types';

const spesialistBaseUrl = config.server.spesialistBaseUrl;

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:9001' : `${spesialistBaseUrl}`;

export interface GraphQLClient {
    postGraphQLQuery: (speilToken: string, data: string) => Promise<request.FullResponse>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): GraphQLClient => ({
    postGraphQLQuery: async (speilToken: string, data: string): Promise<request.FullResponse> => {
        const callId = uuidv4();
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${baseUrl}/graphql`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
                'X-Request-Id': callId,
            },
            resolveWithFullResponse: true,
            json: true,
            body: data,
        };
        const start = Date.now();
        return request.post(options).then((response): Promise<request.FullResponse> => {
            const tidBrukt = Date.now() - start;
            logger.info(`GraphQL-kall til ${baseUrl} med X-Request-Id: ${callId} ferdig etter ${tidBrukt} ms`);
            return response;
        });
    },
});

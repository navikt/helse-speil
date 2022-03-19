import request from 'request-promise-native';

import { OidcConfig, OnBehalfOf } from '../types';
import config from '../config';

const spesialistBaseUrl = config.server.spesialistBaseUrl;

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:9001' : `${spesialistBaseUrl}`;

export interface GraphQLClient {
    postGraphQLQuery: (speilToken: string, data: string) => Promise<request.FullResponse>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): GraphQLClient => ({
    postGraphQLQuery: async (speilToken: string, data: string): Promise<request.FullResponse> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${baseUrl}/graphql`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
            body: data,
        };
        return request.post(options);
    },
});

import request from 'request-promise-native';

import { OidcConfig, OnBehalfOf } from '../types';

export interface GraphQLClient {
    postGraphQLQuery: (speilToken: string, data: string) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): GraphQLClient => ({
    postGraphQLQuery: async (speilToken: string, data: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${
                process.env.NODE_ENV === 'development'
                    ? 'https://spesialist.dev.intern.nav.no'
                    : 'http://spesialist.tbd.svc.nais.local'
            }/graphql`,
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

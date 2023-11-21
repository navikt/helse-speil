import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import logger from '../logging';
import { OidcConfig, OnBehalfOf, SpeilSession } from '../types';

const spesialistBaseUrl = config.server.spesialistBaseUrl;

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:9001' : `${spesialistBaseUrl}`;

export interface GraphQLClient {
    postGraphQLQuery: (speilToken: string, session: SpeilSession, data: string) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): GraphQLClient => ({
    postGraphQLQuery: async (speilToken: string, session: SpeilSession, data: string): Promise<Response> => {
        const callId = uuidv4();
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, session, speilToken);
        const options = {
            method: 'post',
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
                'X-Request-Id': callId,
                'Content-Type': 'application/json',
            },
            body: data,
        };

        logger.debug(
            `Kaller ${baseUrl} med X-Request-Id: ${callId} og onBehalfOfToken: ${onBehalfOfToken.substring(0, 6)}...`,
        );
        const start = Date.now();
        const response = await fetch(`${baseUrl}/graphql`, options);
        const tidBrukt = Date.now() - start;
        logger.debug(`GraphQL-kall til ${baseUrl} med X-Request-Id: ${callId} ferdig etter ${tidBrukt} ms`);
        return response;
    },
});

import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import logger from '../logging';
import { OnBehalfOf } from '../types';

const baseUrl = config.server.spesialistBaseUrl;

export interface GraphQLClient {
    postGraphQLQuery: (accessToken: string, data: string) => Promise<Response>;
}

export default (onBehalfOf: OnBehalfOf): GraphQLClient => ({
    postGraphQLQuery: async (accessToken: string, data: string): Promise<Response> => {
        const callId = uuidv4();
        const onBehalfOfToken = await onBehalfOf.hentFor(process.env.CLIENT_ID_SPESIALIST ?? 'unknown', accessToken);
        const options = {
            method: 'post',
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
                'X-Request-Id': callId,
                'Content-Type': 'application/json',
            },
            body: data,
        };

        const operationName = JSON.parse(data)['operationName'];
        const maskertToken = onBehalfOfToken.substring(0, 6);
        logger.debug(
            `Kaller ${baseUrl} med X-Request-Id: ${callId}, operationName: ${operationName} og token: ${maskertToken}...`,
        );
        const start = Date.now();
        const response = await fetch(`${baseUrl}/graphql`, options);
        const tidBrukt = Date.now() - start;
        logger.debug(
            `GraphQL-kall til ${baseUrl} med X-Request-Id: ${callId} og operationName: ${operationName} ferdig etter ${tidBrukt} ms`,
        );
        return response;
    },
});

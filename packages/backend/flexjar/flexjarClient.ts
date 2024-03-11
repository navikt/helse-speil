import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import logger from '../logging';
import { OidcConfig, OnBehalfOf, SpeilSession } from '../types';

const baseUrl = config.server.flexjarBaseUrl;

export interface FlexjarClient {
    postFlexjarQuery: (speilToken: string, session: SpeilSession, data: string, method?: string) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): FlexjarClient => ({
    postFlexjarQuery: async (
        speilToken: string,
        session: SpeilSession,
        data: string,
        method: string = 'POST',
    ): Promise<Response> => {
        const callId = uuidv4();
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDFlexjar, session, speilToken);
        const options = {
            method,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
                'X-Request-Id': callId,
                'Content-Type': 'application/json',
            },
            body: data,
        };

        console.log(data);

        const maskertToken = onBehalfOfToken.substring(0, 6);
        logger.debug(`Kaller ${baseUrl} med X-Request-Id: ${callId} og token: ${maskertToken}...`);
        const start = Date.now();
        const path = 'api/v2/feedback';
        const response = await fetch(`${baseUrl}/${path}`, options);
        const tidBrukt = Date.now() - start;
        logger.debug(
            `Flexjar-kall til ${baseUrl} med X-Request-Id: ${callId} - ferdig etter ${tidBrukt} ms, response: ${JSON.stringify(
                response,
            )}`,
        );
        return response;
    },
});

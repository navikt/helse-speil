import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import logger from '../logging';
import { OnBehalfOf } from '../types';

const baseUrl = config.server.flexjarBaseUrl;

export interface FlexjarClient {
    postFlexjarQuery: (accessToken: string, data: string, method?: string, urlId?: string) => Promise<object>;
}

export default (onBehalfOf: OnBehalfOf): FlexjarClient => ({
    postFlexjarQuery: async (
        accessToken: string,
        data: string,
        method: string = 'POST',
        urlId: string = '',
    ): Promise<object> => {
        const callId = uuidv4();
        const onBehalfOfToken = await onBehalfOf.hentFor(process.env.CLIENT_ID_FLEXJAR || 'unknown', accessToken);
        const options = {
            method,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
                'X-Request-Id': callId,
                'Content-Type': 'application/json',
            },
            body: data,
        };

        const erMethodPost = method === 'POST';
        const maskertToken = onBehalfOfToken.substring(0, 6);
        logger.debug(`Kaller ${baseUrl} med X-Request-Id: ${callId} og token: ${maskertToken}...`);
        const start = Date.now();
        const path = erMethodPost ? 'api/azure/v2/feedback' : `api/azure/v2/feedback/${urlId}`;
        const response = await fetch(`${baseUrl}/${path}`, options);
        const tidBrukt = Date.now() - start;
        const responseData = erMethodPost ? await response.json() : {};
        logger.debug(
            `Flexjar-kall til ${baseUrl} med X-Request-Id: ${callId} - ferdig etter ${tidBrukt} ms, response: ${JSON.stringify(
                responseData,
            )}`,
        );
        return responseData;
    },
});

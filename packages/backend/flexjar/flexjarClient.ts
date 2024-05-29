import { v4 as uuidv4 } from 'uuid';

import { requestAzureOboToken } from '../auth/token';
import config from '../config';
import logger from '../logging';

const baseUrl = config.server.flexjarBaseUrl;

export interface FlexjarClient {
    postFlexjarQuery: (wonderwallToken: string, data: string, method?: string, urlId?: string) => Promise<object>;
}

export default (): FlexjarClient => ({
    postFlexjarQuery: async (
        wonderwallToken: string,
        data: string,
        method: string = 'POST',
        urlId: string = '',
    ): Promise<object> => {
        const callId = uuidv4();
        const oboResult = await requestAzureOboToken(wonderwallToken, config.oidc.clientIDFlexjar);
        if (!oboResult.ok) {
            throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
        }
        const options = {
            method,
            headers: {
                Authorization: `Bearer ${oboResult.token}`,
                'X-Request-Id': callId,
                'Content-Type': 'application/json',
            },
            body: data,
        };

        const erMethodPost = method === 'POST';
        const maskertToken = oboResult.token.substring(0, 6);
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

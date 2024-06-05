import { v4 as uuidv4 } from 'uuid';

import { byttTilOboToken, hentWonderwallToken } from '@/auth/token';
import { getServerEnv } from '@/env';
import logger from '@/logger';

const postFlexjarQuery = async (
    wonderwallToken: string,
    data: string,
    method: string = 'POST',
    urlId: string = '',
): Promise<object> => {
    const callId = uuidv4();
    const oboResult = await byttTilOboToken(wonderwallToken, getServerEnv().FLEXJAR_SCOPE);
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

    const baseUrl = getServerEnv().FLEXJAR_BASEURL;
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
};

export const postOpprett = async (req: Request) => {
    const token = hentWonderwallToken(req);
    if (!token) {
        return new Response(null, { status: 401 });
    }

    const response = await postFlexjarQuery(token, JSON.stringify(req.body))
        .then((response) => JSON.stringify(response))
        .catch((error) => logger.info(`Sending av feedback til flexjar feilet: ${error}`));
    logger.info(`Sending av feedback til flexjar, respons: ${JSON.stringify(response)}`);

    if (response) Response.json(response, { status: 202 });
    else new Response(null, { status: 500 });
};

export const postOppdater = async (id: string, req: Request) => {
    const token = hentWonderwallToken(req);
    if (!token) {
        return new Response(null, { status: 401 });
    }

    const response = await postFlexjarQuery(token, JSON.stringify(req.body), 'PUT', id).catch((error) => {
        logger.info(`Oppdatering av feedback til flexjar feilet: ${error}`);
    });
    if (response) Response.json({}, { status: 204 });
    else new Response(null, { status: 500 });
};

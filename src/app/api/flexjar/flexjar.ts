import { v4 as uuidv4 } from 'uuid';

import { logger } from '@navikt/next-logger';

import { getServerEnv } from '@/env';
import { byttTilOboToken, hentWonderwallToken } from '@auth/token';

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
    logger.info(`Kaller ${baseUrl} med X-Request-Id: ${callId} og token: ${maskertToken}...`);
    const start = Date.now();
    const path = erMethodPost ? 'api/azure/v2/feedback' : `api/azure/v2/feedback/${urlId}`;
    const response = await fetch(`${baseUrl}/${path}`, options);
    const tidBrukt = Date.now() - start;
    const responseData = erMethodPost ? await response.json() : {};
    logger.info(
        `Flexjar-kall til ${baseUrl} med X-Request-Id: ${callId} - ferdig etter ${tidBrukt} ms, response: ${JSON.stringify(
            responseData,
        )}`,
    );
    return responseData;
};

export const postOpprett = async (req: Request): Promise<Response> => {
    const token = hentWonderwallToken(req);
    if (!token) {
        return new Response(null, { status: 401 });
    }

    const response = await postFlexjarQuery(token, await req.text()).catch((error) =>
        logger.info(`Sending av feedback til flexjar feilet: ${error}`),
    );
    logger.info(`Sending av feedback til flexjar, respons: ${JSON.stringify(response)}`);

    if (response) return Response.json(response, { status: 202 });
    else return new Response(null, { status: 500 });
};

export const postOppdater = async (id: string, req: Request): Promise<Response> => {
    const token = hentWonderwallToken(req);
    if (!token) {
        return new Response(null, { status: 401 });
    }

    const response = await postFlexjarQuery(token, await req.text(), 'PUT', id).catch((error) => {
        logger.info(`Oppdatering av feedback til flexjar feilet: ${error}`);
    });
    if (response) return Response.json({}, { status: 202 });
    else return new Response(null, { status: 500 });
};

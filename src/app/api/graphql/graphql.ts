import { v4 as uuidv4 } from 'uuid';

import { logger } from '@navikt/next-logger';

import { getServerEnv } from '@/env';
import { byttTilOboToken } from '@auth/token';
import { metrics } from '@observability/metrics';

export const postGraphQLQuery = async (wonderwallToken: string, data: string): Promise<Response> => {
    const callId = uuidv4();
    const oboResult = await byttTilOboToken(wonderwallToken, getServerEnv().SPESIALIST_SCOPE);
    if (!oboResult.ok) {
        throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
    }

    const options = {
        method: 'post',
        headers: {
            Authorization: `Bearer ${oboResult.token}`,
            'X-Request-Id': callId,
            'Content-Type': 'application/json',
        },
        body: data,
    };

    const operationName = JSON.parse(data)['operationName'];
    const maskertToken = oboResult.token.substring(0, 6);
    const baseUrl = getServerEnv().SPESIALIST_BASEURL;
    logger.info(
        `Kaller ${baseUrl} med X-Request-Id: ${callId}, operationName: ${operationName} og token: ${maskertToken}...`,
    );
    const stopTimer = metrics.spesialistRequestHistogram.startTimer({ route: '/api/graphql' });
    const response = await fetch(`${baseUrl}/graphql`, options);
    const timerSeconds = stopTimer();
    const tidBrukt = +(timerSeconds * 1000).toFixed(0);
    logger.info(
        `GraphQL-kall til ${baseUrl} med X-Request-Id: ${callId} og operationName: ${operationName} ferdig etter ${tidBrukt} ms`,
    );
    return response;
};

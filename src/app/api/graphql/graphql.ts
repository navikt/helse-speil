import { v4 as uuidv4 } from 'uuid';

import { logger } from '@navikt/next-logger';

import { getServerEnv } from '@/env';
import { WonderwallError, oboTokenViaWonderwall } from '@auth/token';
import { metrics } from '@observability/metrics';

export const postGraphQLQuery = async (req: Request, data: string): Promise<Response> => {
    const callId = uuidv4();

    const baseUrl = getServerEnv().SPESIALIST_BASEURL;

    const oboResult = await oboTokenViaWonderwall(req, getServerEnv().SPESIALIST_SCOPE);
    if (!oboResult.ok) {
        if (oboResult.error satisfies WonderwallError) {
            return new Response(null, { status: 401 });
        } else throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
    }
    const token = oboResult.token;

    const options = {
        method: 'post',
        headers: {
            Authorization: `Bearer ${token}`,
            'X-Request-Id': callId,
            'Content-Type': 'application/json',
        },
        body: data,
    };

    const operationName = JSON.parse(data)['operationName'];
    const maskertToken = token.substring(0, 6);
    logger.debug(
        `Kaller ${baseUrl} med X-Request-Id: ${callId}, operationName: ${operationName} og token: ${maskertToken}...`,
    );
    const stopTimer = metrics.spesialistRequestHistogram.startTimer({ route: '/api/graphql' });
    const response = await fetch(`${baseUrl}/graphql`, options);
    const timerSeconds = stopTimer();
    const tidBrukt = +(timerSeconds * 1000).toFixed(0);
    logger.debug(
        `GraphQL-kall til ${baseUrl} med X-Request-Id: ${callId} og operationName: ${operationName} ferdig etter ${tidBrukt} ms`,
    );
    return response;
};

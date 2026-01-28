import { v4 as uuidv4 } from 'uuid';

import { logger } from '@navikt/next-logger';

import { getServerEnv } from '@/env';
import { byttTilOboToken } from '@auth/token';

export enum Handling {
    velgBrukerIModia,
    nullstillBruker,
}

type Handlingdata = { path: string; method: string };

const handlinger: { [key in Handling]: Handlingdata } = {
    [Handling.velgBrukerIModia]: { path: '/api/context', method: 'POST' },
    [Handling.nullstillBruker]: { path: '/api/context/aktivbruker', method: 'DELETE' },
};

export const kallModia = async (handling: Handling, wonderwallToken: string, data?: string): Promise<Response> => {
    const { method, path } = handlinger[handling];
    const callId = uuidv4();
    const oboResult = await byttTilOboToken(wonderwallToken, getServerEnv().MODIA_SCOPE);
    if (!oboResult.ok) {
        throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
    }
    const options = {
        method: method,
        headers: {
            Authorization: `Bearer ${oboResult.token}`,
            'X-Request-Id': callId,
            'Content-Type': 'application/json',
            'Nav-Consumer-Id': 'speil',
        },
        body: data,
    };

    const modiaBaseUrl = getServerEnv().MODIA_BASEURL;
    const maskertToken = oboResult.token.substring(0, 6);
    const url = `${modiaBaseUrl}${path}`;
    logger.debug(`Kaller ${url} med X-Request-Id: ${callId} og token: ${maskertToken}...`);

    const start = Date.now();
    const response = await fetch(url, options);
    if (!response.ok) throw Error(`Fetch feilet, status: ${response.status}`);

    const tidBrukt = Date.now() - start;
    logger.debug(`Kall til Modia (${modiaBaseUrl}) med X-Request-Id: ${callId} ferdig etter ${tidBrukt} ms`);
    return response;
};

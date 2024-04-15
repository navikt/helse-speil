import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import logger from '../logging';
import { OidcConfig, OnBehalfOf, SpeilSession } from '../types';

const modiaBaseUrl = config.server.modiaBaseUrl;

export interface ModiaClient {
    kallModia: (handling: Handling, speilToken: string, session: SpeilSession, data?: string) => Promise<Response>;
}

export enum Handling {
    velgBrukerIModia,
    nullstillBruker,
}

type Handlingdata = { path: string; method: string };

const handlinger: { [key in Handling]: Handlingdata } = {
    [Handling.velgBrukerIModia]: { path: '/api/context', method: 'post' },
    [Handling.nullstillBruker]: { path: '/api/context/aktivbruker', method: 'delete' },
};

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): ModiaClient => ({
    kallModia: async (
        handling: Handling,
        speilToken: string,
        session: SpeilSession,
        data: string,
    ): Promise<Response> => {
        const { method, path } = handlinger[handling];
        const callId = uuidv4();
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.modiaApiScope, session, speilToken);
        const options = {
            method: method,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
                'X-Request-Id': callId,
                'Content-Type': 'application/json',
                'Nav-Consumer-Id': 'speil',
            },
            body: JSON.stringify(data),
        };

        const maskertToken = onBehalfOfToken.substring(0, 6);
        const url = `${modiaBaseUrl}${path}`;
        logger.debug(`Kaller ${url} med X-Request-Id: ${callId} og token: ${maskertToken}...`);

        const start = Date.now();
        const response = await fetch(url, options);
        if (!response.ok) throw Error(`Fetch feilet, status: ${response.status}`);

        const tidBrukt = Date.now() - start;
        logger.debug(`Kall til Modia (${modiaBaseUrl}) med X-Request-Id: ${callId} ferdig etter ${tidBrukt} ms`);
        return response;
    },
});

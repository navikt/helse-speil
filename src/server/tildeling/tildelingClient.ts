import request from 'request-promise-native';

import config from '../config';
import { OidcConfig, OnBehalfOf } from '../types';

const spesialistBaseUrl = config.server.spesialistBaseUrl;

export interface TildelingClient {
    postTildeling: (tildeling: Tildeling, speilToken: string) => Promise<Response>;
    fjernTildeling: (tildeling: Tildeling, speilToken: string) => Promise<Response>;
}

export interface Tildeling {
    oppgavereferanse: string;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): TildelingClient => ({
    postTildeling: async (tildeling: Tildeling, speilToken: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${spesialistBaseUrl}/api/tildeling/${tildeling.oppgavereferanse}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.post(options);
    },

    fjernTildeling: async (tildeling: Tildeling, speilToken: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${spesialistBaseUrl}/api/tildeling/${tildeling.oppgavereferanse}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.del(options);
    },
});

import request from 'request-promise-native';
import { OidcConfig, OnBehalfOf } from '../types';

export interface TildelingClient {
    postTildeling: (tildeling: Tildeling, speilToken: string) => Promise<Response>;
    fjernTildeling: (body: FjernTildeling, speilToken: string) => Promise<Response>;
}

interface FjernTildeling {
    oppgavereferanse: string;
}

interface Tildeling {
    oppgavereferanse: string;
    userId: string;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): TildelingClient => ({
    postTildeling: async (tildeling: Tildeling, speilToken: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/v1/tildeling/${tildeling.oppgavereferanse}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.post(options);
    },

    fjernTildeling: async (body: FjernTildeling, speilToken: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/v1/tildeling/${body.oppgavereferanse}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.del(options);
    },
});

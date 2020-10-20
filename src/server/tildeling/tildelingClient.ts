import request from 'request-promise-native';
import { OidcConfig, OnBehalfOf } from '../types';
import { Tildeling } from 'internal-types';

export interface TildelingClient {
    postTildeling: (tildeling: Tildeling, speilToken: string) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): TildelingClient => ({
    postTildeling: async (tildeling: Tildeling, speilToken: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/tildeling/${tildeling.oppgavereferanse}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.post(options);
    },
});

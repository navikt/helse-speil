import request from 'request-promise-native';

import { OidcConfig, OnBehalfOf } from '../types';

export interface LeggPåVentClient {
    leggPåVent: (speilToken: string, oppgaveReferanse: string) => Promise<Response>;
    fjernPåVent: (speilToken: string, oppgaveReferanse: string) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): LeggPåVentClient => ({
    leggPåVent: async (speilToken: string, oppgaveReferanse: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/leggpåvent/${oppgaveReferanse}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.post(options);
    },

    fjernPåVent: async (speilToken: string, oppgaveReferanse: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/leggpåvent/${oppgaveReferanse}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.delete(options);
    },
});

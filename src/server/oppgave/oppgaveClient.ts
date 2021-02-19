import { OidcConfig, OnBehalfOf } from '../types';
import request from 'request-promise-native';

export interface OppgaveClient {
    leggPåVent: (speilToken: string, oppgaveReferanse: string) => Promise<Response>;
    fjernPåVent: (speilToken: string, oppgaveReferanse: string) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): OppgaveClient => ({
    leggPåVent: async (speilToken: string, oppgaveReferanse: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/oppgave/vent`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            body: {
                oppgaveReferanse,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.post(options);
    },

    fjernPåVent: async (speilToken: string, oppgaveReferanse: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/oppgave/vent`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            body: {
                oppgaveReferanse,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.delete(options);
    },
});

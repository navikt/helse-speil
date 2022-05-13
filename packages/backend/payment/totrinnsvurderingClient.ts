import request from 'request-promise-native';

import { OidcConfig, OnBehalfOf } from '../types';
import config from '../config';

const spesialistBaseUrl = config.server.spesialistBaseUrl;

export interface PostTotrinnsvurderingParams {
    aktørId: string;
    fødselsnummer: string;
    saksbehandlerIdent: string;
    speilToken: string;
    vedtaksperiodeId: string;
}

export interface TotrinnsvurderingClient {
    totrinnsvurdering: (speilToken: string, oppgaveReferanse: string) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): TotrinnsvurderingClient => ({
    totrinnsvurdering: async (speilToken: string, oppgaveReferanse: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${spesialistBaseUrl}/api/totrinnsvurdering/${oppgaveReferanse}`,
            headers: { Authorization: `Bearer ${onBehalfOfToken}` },
            resolveWithFullResponse: true,
            json: true,
        };

        return request.post(options);
    },
});

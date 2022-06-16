import request from 'request-promise-native';

import { NotatDTO, OidcConfig, OnBehalfOf } from '../types';
import config from '../config';

const spesialistBaseUrl = config.server.spesialistBaseUrl;

export interface PostTotrinnsvurderingParams {
    oppgavereferanse: string;
    beregningId: string;
}
export interface PostBeslutteroppgaveReturParams {
    oppgavereferanse: string;
    beregningId: string;
    notat: NotatDTO;
}

export interface TotrinnsvurderingClient {
    totrinnsvurdering: (speilToken: string, body: PostTotrinnsvurderingParams) => Promise<Response>;
    beslutteroppgaveretur: (speilToken: string, body: PostBeslutteroppgaveReturParams) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): TotrinnsvurderingClient => ({
    totrinnsvurdering: async (speilToken: string, body: PostTotrinnsvurderingParams): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${spesialistBaseUrl}/api/totrinnsvurdering`,
            headers: { Authorization: `Bearer ${onBehalfOfToken}` },
            body: { oppgavereferanse: body.oppgavereferanse, beregningId: body.beregningId },
            resolveWithFullResponse: true,
            json: true,
        };

        return request.post(options);
    },
    beslutteroppgaveretur: async (speilToken: string, body: PostBeslutteroppgaveReturParams): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${spesialistBaseUrl}/api/totrinnsvurdering/retur`,
            headers: { Authorization: `Bearer ${onBehalfOfToken}` },
            body: { oppgavereferanse: body.oppgavereferanse, beregningId: body.beregningId, notat: body.notat },
            resolveWithFullResponse: true,
            json: true,
        };

        return request.post(options);
    },
});

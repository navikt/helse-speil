import request from 'request-promise-native';

import { OidcConfig, OnBehalfOf } from '../types';
import config from '../config';

const spesialistBaseUrl = config.server.spesialistBaseUrl;

export interface PostTotrinnsvurderingParams {
    oppgavereferanse: string;
    periodeId: string;
}
export interface PostBeslutteroppgaveReturParams {
    oppgavereferanse: string;
    periodeId: string;
    notat: string;
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
            body: { oppgavereferanse: body.oppgavereferanse, periodeId: body.periodeId },
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
            body: { oppgavereferanse: body.oppgavereferanse, periodeId: body.periodeId, notat: body.notat },
            resolveWithFullResponse: true,
            json: true,
        };

        return request.post(options);
    },
});

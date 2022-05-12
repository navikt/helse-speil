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
    totrinnsvurdering: (body: PostTotrinnsvurderingParams, accessToken?: string) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf) => ({
    totrinnsvurdering: async ({
        aktørId,
        fødselsnummer,
        saksbehandlerIdent,
        speilToken,
        vedtaksperiodeId,
    }: PostTotrinnsvurderingParams) => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${spesialistBaseUrl}/api/totrinnsvurdering`,
            headers: { Authorization: `Bearer ${onBehalfOfToken}` },
            body: {
                aktørId,
                fødselsnummer,
                saksbehandlerIdent,
                vedtaksperiodeId,
            },
            json: true,
        };

        return request.post(options);
    },
});

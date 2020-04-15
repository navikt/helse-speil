import request from 'request-promise-native';
import { OidcConfig, OnBehalfOf } from '../types';

interface PostVedtakOptions {
    behovId: string;
    aktørId: string;
    saksbehandlerIdent: string;
    vedtaksperiodeId: string;
    godkjent: boolean;
    speilToken: string;
}

export interface VedtakClient {
    postVedtak: (body: PostVedtakOptions, accessToken?: string) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf) => ({
    postVedtak: async ({
        behovId,
        aktørId,
        saksbehandlerIdent,
        vedtaksperiodeId,
        godkjent,
        speilToken
    }: PostVedtakOptions) => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpade, speilToken);
        const options = {
            uri: `http://spade.default.svc.nais.local/api/vedtak`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`
            },
            body: { behovId, aktørId, saksbehandlerIdent, godkjent, vedtaksperiodeId },
            json: true
        };

        return request.post(options);
    }
});

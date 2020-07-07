import request from 'request-promise-native';
import { OidcConfig, OnBehalfOf } from '../types';

interface PostVedtakOptions {
    oppgavereferanse: string;
    godkjent: boolean;
    speilToken: string;
    saksbehandlerIdent: string;
}

interface PostVedtakAvslåttOptions {
    oppgavereferanse: string;
    godkjent: boolean;
    speilToken: string;
    saksbehandlerIdent: string;
    årsak: string;
    begrunnelser?: string[];
    kommentar?: string;
}

export interface VedtakClient {
    postVedtak: (body: PostVedtakOptions | PostVedtakAvslåttOptions) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf) => ({
    postVedtak: async (params: PostVedtakOptions | PostVedtakAvslåttOptions) => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, params.speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/vedtak`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            body: params,
            json: true,
        };
        return request.post(options);
    },
});

import request from 'request-promise-native';

import config from '../config';
import { OidcConfig, OnBehalfOf } from '../types';

const spesialistBaseUrl = config.server.spesialistBaseUrl;

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
            uri: `${spesialistBaseUrl}/api/vedtak`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            body: params,
            json: true,
        };
        return request.post(options);
    },
});

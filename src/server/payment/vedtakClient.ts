import request from 'request-promise-native';
import { OidcConfig, OnBehalfOf } from '../types';

interface PostVedtakOptions {
    behovId: string;
    godkjent: boolean;
    speilToken: string;
}

export interface VedtakClient {
    postVedtak: (body: PostVedtakOptions, accessToken?: string) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf) => ({
    postVedtak: async ({ behovId, godkjent, speilToken }: PostVedtakOptions) => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.default.svc.nais.local/api/vedtak`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`
            },
            body: { behovId, godkjent },
            json: true
        };

        return request.post(options);
    }
});

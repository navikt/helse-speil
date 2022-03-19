import request from 'request-promise-native';

import { NotatDTO, OidcConfig, OnBehalfOf } from '../types';
import config from '../config';

const spesialistBaseUrl = config.server.spesialistBaseUrl;

export interface NotatClient {
    postNotat: (speilToken: string, vedtaksperiodeId: string, notat: NotatDTO) => Promise<Response>;
    feilregistrerNotat: (speilToken: string, vedtaksperiodeId: string, notatId: string) => Promise<Response>;
    getNotat: (speilToken: string, vedtaksperiodeId: string) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): NotatClient => ({
    postNotat: async (speilToken: string, vedtaksperiodeId: string, notat: NotatDTO): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${spesialistBaseUrl}/api/notater/${vedtaksperiodeId}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
            body: notat,
        };
        return request.post(options);
    },
    feilregistrerNotat: async (speilToken: string, vedtaksperiodeId: string, notatId: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${spesialistBaseUrl}/api/notater/${vedtaksperiodeId}/feilregistrer/${notatId}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.put(options);
    },
    getNotat: async (speilToken: string, vedtaksperiodeIder: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${spesialistBaseUrl}/api/notater?${vedtaksperiodeIder}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.get(options);
    },
});

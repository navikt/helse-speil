import request from 'request-promise-native';

import { OidcConfig, OnBehalfOf } from '../types';

export interface OpptegnelseClient {
    abonnerPåAktør: (speilToken: string, aktorId: string) => Promise<Response>;
    getAlleOpptegnelser: (speilToken: string) => Promise<Response>;
    getOpptegnelser: (speilToken: string, sisteSekvensId: number) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): OpptegnelseClient => ({
    abonnerPåAktør: async (speilToken: string, aktorId: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/opptegnelse/abonner/${aktorId}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.post(options);
    },
    getAlleOpptegnelser: async (speilToken: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/opptegnelse/hent`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.get(options);
    },
    getOpptegnelser: async (speilToken: string, sisteSekvensId: number): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/opptegnelse/hent/${sisteSekvensId}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.get(options);
    },
});

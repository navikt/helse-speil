import request from 'request-promise-native';

import { Instrumentation } from '../instrumentation';
import { OidcConfig, OnBehalfOf } from '../types';

export interface SpesialistClient {
    behandlingerForPeriode: (onBehalfOfToken: string) => Promise<Response>;
    hentPersonByAktørId: (aktørId: string, onBehalfOfToken: string) => Promise<Response>;
    hentPersonByFødselsnummer: (fødselsnummer: string, onBehalfOfToken: string) => Promise<Response>;
    hentBehandlingsstatistikk: (speilToken: string) => Promise<Response>;
}

export const spesialistClient = (
    instrumentation: Instrumentation,
    oidcConfig: OidcConfig,
    onBehalfOf: OnBehalfOf
): SpesialistClient => ({
    behandlingerForPeriode: async (onBehalfOfToken): Promise<Response> => {
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/oppgaver`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        const tidtakning = instrumentation.requestHistogram.startTidtakning('/api/oppgaver');
        return request
            .get(options)
            .then((res) => {
                tidtakning();
                return {
                    status: res.statusCode,
                    body: res.body,
                } as Response;
            })
            .catch((err) => {
                throw oversettTilInterntFormat(err);
            });
    },

    hentPersonByAktørId: async (aktørId, onBehalfOfToken): Promise<Response> => {
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/person/aktorId/${aktørId}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        const tidtakning = instrumentation.requestHistogram.startTidtakning('/api/person/aktorId');
        return request
            .get(options)
            .then((res) => {
                tidtakning();
                return {
                    status: res.statusCode,
                    body: res.body,
                } as Response;
            })
            .catch((err) => {
                throw oversettTilInterntFormat(err);
            });
    },

    hentPersonByFødselsnummer: async (fødselsnummer, onBehalfOfToken): Promise<Response> => {
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/person/fnr/${fødselsnummer}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        const tidtakning = instrumentation.requestHistogram.startTidtakning('/api/person/fnr');
        return request
            .get(options)
            .then((res) => {
                tidtakning();
                return {
                    status: res.statusCode,
                    body: res.body,
                } as Response;
            })
            .catch((err) => {
                throw oversettTilInterntFormat(err);
            });
    },
    hentBehandlingsstatistikk: async (speilToken: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = getOptions(onBehalfOfToken, 'behandlingsstatistikk');

        return request
            .get(options)
            .then((res) => oversettTilInterntFormat(res))
            .catch((err) => {
                throw oversettTilInterntFormat(err);
            });
    },
});

const getOptions = (onBehalfOfToken: string, endepunkt: string, body?: any) => {
    return {
        uri: `http://spesialist.tbd.svc.nais.local/api/${endepunkt}`,
        headers: {
            Authorization: `Bearer ${onBehalfOfToken}`,
        },
        resolveWithFullResponse: true,
        json: true,
        body: body,
    };
};

const oversettTilInterntFormat = (response: any) =>
    ({
        status: response.statusCode,
        body: response.body,
    } as Response);

export default spesialistClient;

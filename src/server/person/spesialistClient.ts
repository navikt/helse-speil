import request from 'request-promise-native';
import { Instrumentation } from '../instrumentation';

export interface SpesialistClient {
    behandlingerForPeriode: (onBehalfOfToken: string) => Promise<Response>;
    hentPersonByAktørId: (aktørId: string, onBehalfOfToken: string) => Promise<Response>;
    hentPersonByFødselsnummer: (fødselsnummer: string, onBehalfOfToken: string) => Promise<Response>;
}

export const spesialistClient = (instrumentation: Instrumentation): SpesialistClient => ({
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
        return request.get(options).then((res) => {
            tidtakning();
            return Promise.resolve(({
                status: res.statusCode,
                body: res.body,
            } as unknown) as Response);
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
        return request.get(options).then((res) => {
            tidtakning();
            return Promise.resolve(({
                status: res.statusCode,
                body: res.body,
            } as unknown) as Response);
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
        return request.get(options).then((res) => {
            tidtakning();
            return Promise.resolve(({
                status: res.statusCode,
                body: res.body,
            } as unknown) as Response);
        });
    },
});

export default spesialistClient;

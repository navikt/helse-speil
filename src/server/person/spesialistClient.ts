import request from 'request-promise-native';

export interface SpesialistClient {
    behandlingerForPeriode: (fom: string, tom: string, onBehalfOfToken: string) => Promise<Response>;
    hentPersonByAktørId: (aktørId: string, onBehalfOfToken: string) => Promise<Response>;
    hentPersonByFødselsnummer: (fødselsnummer: string, onBehalfOfToken: string) => Promise<Response>;
    hentSakByUtbetalingsref: (utbetalingsref: string, onBehalfOfToken: string) => Promise<Response>;
}

export const spesialistClient: SpesialistClient = {
    behandlingerForPeriode: async (fom, tom, onBehalfOfToken) => {
        const options = {
            uri: `http://spesialist.default.svc.nais.local/api/oppgaver`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`
            },
            resolveWithFullResponse: true,
            json: true
        };
        return request.get(options);
    },

    hentPersonByAktørId: async (aktørId, onBehalfOfToken) => {
        const options = {
            uri: `http://spesialist.default.svc.nais.local/api/person/aktorId/${aktørId}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`
            },
            resolveWithFullResponse: true,
            json: true
        };
        return request.get(options);
    },

    hentPersonByFødselsnummer: async (fødselsnummer, onBehalfOfToken) => {
        const options = {
            uri: `http://spesialist.default.svc.nais.local/api/person/fnr/${fødselsnummer}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`
            },
            resolveWithFullResponse: true,
            json: true
        };
        return request.get(options);
    },

    hentSakByUtbetalingsref: async (utbetalingsref, onBehalfOfToken) => {
        const options = {
            uri: `http://spesialist.default.svc.nais.local/api/person/utbetaling/${utbetalingsref}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`
            },
            resolveWithFullResponse: true,
            json: true
        };
        return request.get(options);
    }
};

export default spesialistClient;

import request from 'request-promise-native';
import { Oppgave } from '../../types';
import { SpesialistPerson } from '../../client/context/mapping/external.types';

export interface OppgaveResponse {
    statusCode: number;
    body: Oppgave;
}

export interface SpesialistClient {
    behandlingerForPeriode: (fom: string, tom: string, accessToken: string) => Promise<OppgaveResponse>;
    hentPersonByAktørId: (aktørId: string, onBehalfOfToken: string) => Promise<Response>;
    hentPersonByFødselsnummer: (fødselsnummer: string, onBehalfOfToken: string) => Promise<Response>;
    hentSakByUtbetalingsref: (utbetalingsref: string, onBehalfOfToken: string) => Promise<Response>;
}

export const spesialistClient: SpesialistClient = {
    behandlingerForPeriode: (fom, tom, accessToken) => {
        const options = {
            uri: `http://spesialist.default.svc.nais.local/api/oppgaver`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            json: true,
            resolveWithFullResponse: true
        };
        return request.get(options);
    },

    hentPersonByAktørId: async (aktørId, onBehalfOfToken) => {
        const options = {
            uri: `http://spesialist.default.svc.nais.local/api/oppgaver/api/person/aktorId/${aktørId}`,
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
            uri: `http://spesialist.default.svc.nais.local/api/oppgaver/api/person/fnr/${fødselsnummer}`,
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

import request from 'request-promise-native';
import * as fs from 'fs';
import { SpesialistClient } from '../person/spesialistClient';
import { SpesialistOppgave } from '../../types';
import { Instrumentation } from '../instrumentation';

const devSpesialistClient = (instrumentation: Instrumentation): SpesialistClient => ({
    behandlingerForPeriode: async (_accessToken: string): Promise<Response> => {
        const fromFile = fs.readFileSync('__mock-data__/oppgaver.json', 'utf-8');
        const tidtakning = instrumentation.requestHistogram.startTidtakning('/api/oppgaver');
        const oppgaver = await Promise.all(
            JSON.parse(fromFile).map(async (oppgave: SpesialistOppgave) => ({
                ...oppgave,
                saksbehandlerepost: await hentTildeling(oppgave.oppgavereferanse),
            }))
        );
        tidtakning();
        return Promise.resolve(({
            status: 200,
            body: oppgaver,
        } as unknown) as Response);
    },

    hentPersonByAktørId: async (aktørId: string): Promise<Response> => {
        const fromFile = fs.readFileSync(`__mock-data__/${filenameForPersonId(aktørId)}`, 'utf-8');
        const tidtakning = instrumentation.requestHistogram.startTidtakning('/api/person/aktørId');
        const person = JSON.parse(fromFile);
        tidtakning();
        return Promise.resolve({
            status: 200,
            body: person,
        } as Response);
    },
    hentPersonByFødselsnummer: async (aktørId: string): Promise<Response> => {
        const tidtakning = instrumentation.requestHistogram.startTidtakning('/api/person/fnr');
        const fromFile = fs.readFileSync(`__mock-data__/${filenameForPersonId(aktørId)}`, 'utf-8');
        const person = JSON.parse(fromFile);
        tidtakning();
        return Promise.resolve({
            status: 200,
            body: person,
        } as Response);
    },
});

const hentTildeling = (oppgavereferanse: string) => {
    const options = {
        uri: `http://localhost:9001/api/v1/tildeling/${oppgavereferanse}`,
        resolveWithFullResponse: true,
    };
    return request
        .get(options)
        .then((res) => res.body)
        .catch(() => {});
};

export const tildel = (oppgavereferanse: string, saksbehandler: string) => {
    const options = {
        uri: `http://localhost:9001/api/v1/tildeling/${oppgavereferanse}`,
        resolveWithFullResponse: true,
    };
    return request
        .post(options)
        .then((res) => res.body)
        .catch(() => {});
};

const filenameForPersonId = (id: string) => {
    switch (id) {
        case '1000000009871':
        case '12020069420':
            return 'knugen_til-godkjenning.json';
        case '87654321962123':
        case '12020042069':
            return 'sonja_2perioder.json';
        case '87650000962123':
        case '21010462423':
            return 'ingrid-alexandra_infotrygd-direkteovergang.json';
        case '57650000444423':
        case '22097112413':
            return 'märtha_infotrygd-forlengelse.json';
        case '1000000000009':
        case '03120520135':
            return 'sverre-magnus_første-periode-uten-utbetaling.json';
        case '1234':
        case '01010025678':
            return 'leah-isadora_til-utbetaling.json';
        case '12345':
        case '01010025676':
            return 'durek_med-overstyringer.json';
        case '102030':
            return 'emma-tallulah_til-utbetaling-automatisk-behandlet.json';
        default:
            return 'håkon_3perioder_første_periode_kort.json';
    }
};

export default devSpesialistClient;

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
        uri: `http://localhost:9001/api/tildeling/${oppgavereferanse}`,
        resolveWithFullResponse: true,
    };
    return request
        .get(options)
        .then((res) => res.body)
        .catch(() => {});
};

export const tildel = (oppgavereferanse: string) => {
    const options = {
        uri: `http://localhost:9001/api/tildeling/${oppgavereferanse}`,
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
            return 'kong-harald_til-godkjenning.json';
        case '87654321962123':
        case '12020042069':
            return 'sonja_2perioder.json';
        case '87650000962123':
        case '21010462423':
            return 'ingrid-alexandra_infotrygd-direkteovergang.json';
        case '57650000444423':
        case '22097112413':
            return 'märtha_infotrygd-forlengelse.json';
        case '11650007744423':
        case '02070312413':
            return 'olav_rex_annuleringer.json';
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
        case '1672157246605':
        case '27018221468':
            return 'knugen.json';
        case '87654321962124':
        case '20077362124':
            return 'håkon_3perioder_første_periode_kort.json';
        case '87750000962123':
        case '02070362123':
            return 'kong-olav_bare-infotrygdhistorikk.json';
        case '4526426893428':
            return 'maud-angelica_utbetalt.json';
        case '6549846514988':
            return 'muffins_kråkebolle_it_forlengelse.json';
        case '1000000008971':
        case '13019769420':
            return 'marius-borg-høiby_stikkprøve.json';
        case '87850000962123':
        case '21042662423':
            return 'elizabeth-alexandra-mary-windsor.json';
        default:
            throw new Error('Mangler oppsett i devSpesialistClient.ts');
    }
};

export default devSpesialistClient;

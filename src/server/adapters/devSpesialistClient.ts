import * as fs from 'fs';
import { SpesialistClient } from '../person/spesialistClient';

const behandlingerForPeriode = (_accessToken: string): Promise<Response> => {
    const fromFile = fs.readFileSync('__mock-data__/oppgaver.json', 'utf-8');
    const oppgaver = JSON.parse(fromFile);
    return Promise.resolve({
        status: 200,
        body: oppgaver,
    } as Response);
};

const hentPersonByAktørId = async (aktørId: string): Promise<Response> => {
    const fromFile = fs.readFileSync(`__mock-data__/${filenameForPersonId(aktørId)}`, 'utf-8');
    const person = JSON.parse(fromFile);
    return Promise.resolve({
        status: 200,
        body: person,
    } as Response);
};

const hentPersonByFødselsnummer = async (aktørId: string): Promise<Response> => {
    const fromFile = fs.readFileSync(`__mock-data__/${filenameForPersonId(aktørId)}`, 'utf-8');
    const person = JSON.parse(fromFile);
    return Promise.resolve({
        status: 200,
        body: person,
    } as Response);
};

const filenameForPersonId = (id: string) => {
    switch (id) {
        case '1000000009871':
        case '12020069420':
            return 'mock-person_til-godkjenning.json';
        case '87654321962123':
        case '12020042069':
            return 'mock-person_2perioder.json';
        case '87650000962123':
        case '21010462423':
            return 'mock-person_infotrygd-direkteovergang.json';
        case '57650000444423':
        case '22097112413':
            return 'mock-person_infotrygd-forlengelse.json';
        case '1000000000009':
        case '03120520135':
            return 'mock-person_første-periode-uten-utbetaling.json';
        case '1234':
        case '01010025678':
            return 'mock-person_til-utbetaling.json';
        default:
            return 'mock-person_3perioder_første_periode_kort.json';
    }
};

const devSpesialistClient: SpesialistClient = {
    behandlingerForPeriode,
    hentPersonByAktørId,
    hentPersonByFødselsnummer,
};

export default devSpesialistClient;

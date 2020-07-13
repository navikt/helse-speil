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
    const fromFile = fs.readFileSync(`__mock-data__/${filename(aktørId)}`, 'utf-8');
    const person = JSON.parse(fromFile);
    return Promise.resolve({
        status: 200,
        body: person,
    } as Response);
};

const hentPersonByFødselsnummer = async (aktørId: string): Promise<Response> => {
    const fromFile = fs.readFileSync(`__mock-data__/${filename(aktørId)}`, 'utf-8');
    const person = JSON.parse(fromFile);
    return Promise.resolve({
        status: 200,
        body: person,
    } as Response);
};

const filename = (aktørId: string) => {
    switch (aktørId) {
        case '1000000009871':
            return 'mock-person_til-godkjenning.json';
        case '87654321962123':
            return 'mock-person_2perioder.json';
        case '87650000962123':
            return 'mock-person_infotrygd-direkteovergang.json';
        case '57650000444423':
            return 'mock-person_infotrygd-forlengelse.json';
        case '1000000000009':
            return 'mock-person_første-periode-uten-utbetaling.json';
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

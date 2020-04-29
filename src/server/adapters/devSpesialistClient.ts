import * as fs from 'fs';
import { SpesialistClient } from '../person/spesialistClient';

const behandlingerForPeriode = (_fom: string, _tom: string, _accessToken: string) => {
    const fromFile = fs.readFileSync('__mock-data__/oppgaver.json', 'utf-8');
    const behov = JSON.parse(fromFile);
    return Promise.resolve(({
        statusCode: 200,
        body: behov
    } as unknown) as Response);
};

const hentPersonByAktørId = async (aktørId: string) => {
    const fromFile = fs.readFileSync(`__mock-data__/${filename(aktørId)}`, 'utf-8');
    const person = JSON.parse(fromFile);
    return Promise.resolve(({
        statusCode: 200,
        body: person
    } as unknown) as Response);
};

const hentPersonByFødselsnummer = async (aktørId: string) => {
    const fromFile = fs.readFileSync(`__mock-data__/${filename(aktørId)}`, 'utf-8');
    const person = JSON.parse(fromFile);
    return Promise.resolve(({
        statusCode: 200,
        body: person
    } as unknown) as Response);
};

const hentSakByUtbetalingsref = async () => {
    const fromFile = fs.readFileSync(`__mock-data__/mock-person_til-utbetaling.json`, 'utf-8');
    const person = JSON.parse(fromFile);
    return Promise.resolve(({
        statusCode: 200,
        body: person
    } as unknown) as Response);
};

const filename = (aktørId: string) => {
    switch (aktørId) {
        case '1000000009871':
            return 'mock-person_til-godkjenning.json';
        case '87654321962123':
            return 'mock-person_2perioder.json';
        default:
            return 'mock-person_til-utbetaling.json';
    }
};

const devSpesialistClient: SpesialistClient = {
    behandlingerForPeriode,
    hentPersonByAktørId,
    hentPersonByFødselsnummer,
    hentSakByUtbetalingsref
};

export default devSpesialistClient;

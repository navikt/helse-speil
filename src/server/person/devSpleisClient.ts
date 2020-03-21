import fs from 'fs';
import { SpleisClient } from './spleisClient';

const hentPerson = async (aktørId: string) => {
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
            return 'mock-person_3perioder_første_periode_kort.json';
    }
};

const spleisClient: SpleisClient = {
    hentPerson,
    hentSakByUtbetalingsref
};

export default spleisClient;

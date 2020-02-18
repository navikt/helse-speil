import request from 'request-promise-native';
import fs from 'fs';
import { Behov } from '../../types';

export interface SpleisClient {
    hentSak: (aktørId: string, onBehalfOfToken: string) => Promise<Behov>;
    hentSakByUtbetalingsref: (utbetalingsref: string, onBehalfOfToken: string) => Promise<Behov>;
}

const hentSakByAktørId = async (aktørId: string, onBehalfOfToken: string) => {
    if (process.env.NODE_ENV === 'development') {
        const fromFile = fs.readFileSync(`__mock-data__/${filename(aktørId)}`, 'utf-8');
        const person = JSON.parse(fromFile);
        return Promise.resolve({
            statusCode: 200,
            body: person
        });
    }
    const options = {
        uri: `http://spleis.default.svc.nais.local/api/person/${aktørId}`,
        headers: {
            Authorization: `Bearer ${onBehalfOfToken}`
        },
        resolveWithFullResponse: true,
        json: true
    };
    return request.get(options);
};

const hentSakByUtbetalingsref = async (utbetalingsref: string, onBehalfOfToken: string) => {
    if (process.env.NODE_ENV === 'development') {
        const fromFile = fs.readFileSync(`__mock-data__/mock-person_til-utbetaling.json`, 'utf-8');
        const person = JSON.parse(fromFile);
        return Promise.resolve({
            statusCode: 200,
            body: person
        });
    }
    const options = {
        uri: `http://spleis.default.svc.nais.local/api/utbetaling/${utbetalingsref}`,
        headers: {
            Authorization: `Bearer ${onBehalfOfToken}`
        },
        resolveWithFullResponse: true,
        json: true
    };
    return request.get(options);
};

const filename = (aktørId: string) =>
    aktørId === '87654321962123' || !/[0-9]/.test(aktørId)
        ? 'mock-person_2perioder.json'
        : 'mock-person_til-godkjenning.json';

const spleisClient: SpleisClient = {
    hentSak: hentSakByAktørId,
    hentSakByUtbetalingsref
};

export default spleisClient;

'use strict';

const fs = require('fs');

const rpn = jest.genMockFromModule('request-promise-native');

const testPerson = {
    fdato: '1995-01-01',
    statsborgerskap: 'NOR',
    etternavn: 'BETJENT',
    aktørId: '1000012345678',
    bostedsland: 'NOR',
    fornavn: 'BJARNE',
    kjønn: 'MANN',
    status: 'BOSA'
};

rpn.get = options => {
    if (options.uri.includes('/sts/')) {
        if (options.headers.Authorization.includes('Ym9ndXM6Y3JlZHM=')) {
            return Promise.reject('wrong creds');
        } else {
            return Promise.resolve({
                access_token: createToken({ exp: 12345 })
            });
        }
    } else if (options.uri.includes('/api/v1/identer')) {
        return handleAktørregisteretRequest();
    } else if (options.uri.includes('behov/periode')) {
        return Promise.resolve({ body: JSON.parse(mockBehandlingerPeriod()) });
    } else {
        if (options.uri.includes('11111')) {
            return Promise.resolve(testPerson);
        } else {
            return Promise.reject('request failed');
        }
    }
};

rpn.post = options => {
    return Promise.resolve(mockSpennData());
};

const handleAktørregisteretRequest = () => {
    return Promise.resolve(aktørregisteretResponse);
};

let aktørregisteretResponse;
rpn.prepareAktørregisteretResponse = response => {
    aktørregisteretResponse = response;
};

const createToken = claims => {
    const header = { alg: 'HS256', typ: 'JWT' };
    return `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(claims))}.bogussignature`;
};

const mockSpennData = () => fs.readFileSync('__mock-data__/spenn-reply.json', 'utf-8');

const mockBehandlingerPerson = () => fs.readFileSync('__mock-data__/behandlinger.json', 'utf-8');

const mockBehandlingerPeriod = () =>
    fs.readFileSync('__mock-data__/behandlingsummaries.json', 'utf-8'); // TODO: behandlinger => det nye

module.exports = rpn;

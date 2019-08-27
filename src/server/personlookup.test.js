'use strict';

const request = require('request');

const personLookup = require('../../src/server/personlookup');

beforeEach(() => {
    personLookup.init({
        serviceUserName: 'da_usah',
        serviceUserPassword: 'pazzwd',
        stsUrl: 'http://localhost'
    });
});

test('successful person lookup resolves with mapped person object', () => {
    request.setStsStatusCode(200);
    request.setStsResponseBody({
        access_token: createToken({ exp: 12345 })
    });
    request.setPersonStatusCode(200);
    request.setPersonResponseBody({
        fdato: '1995-01-01',
        statsborgerskap: 'NOR',
        etternavn: 'BETJENT',
        aktørId: '1000012345678',
        bostedsland: 'NOR',
        fornavn: 'BJARNE',
        kjønn: 'MANN',
        status: 'BOSA'
    });

    expect(personLookup.hentPerson('12345')).resolves.toEqual({
        navn: 'BJARNE BETJENT',
        kjønn: 'MANN'
    });
});

test('logon failure -> rejection', () => {
    request.setStsStatusCode(500);
    expect(personLookup.hentPerson('12345')).rejects.toMatch('Error');
});

test('lookup failure -> rejection', () => {
    request.setStsStatusCode(200);
    request.setStsResponseBody({
        access_token: 'some_token'
    });
    request.setPersonStatusCode(500);

    expect(personLookup.hentPerson('12345')).rejects.toMatch('Error');
});

const createToken = claims => {
    const header = { alg: 'HS256', typ: 'JWT' };
    return `${btoa(JSON.stringify(header))}.${btoa(
        JSON.stringify(claims)
    )}.bogussignature`;
};

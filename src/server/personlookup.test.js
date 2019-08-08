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

test('successful person lookup resolves with person object', () => {
    request.setStsStatusCode(200);
    request.setStsResponseBody({
        access_token: 'some_token'
    });
    request.setPersonStatusCode(200);
    request.setPersonResponseBody({ navn: 'Navn Navnesen' });

    expect(personLookup.hentPerson('12345')).resolves.toEqual({
        navn: 'Navn Navnesen'
    });
});

test('logon failure -> rejection', () => {
    request.setStsStatusCode(500);

    expect(personLookup.hentPerson('12345')).rejects.toMatch(
        'Error during STS login'
    );
});

test('lookup failure -> rejection', () => {
    request.setStsStatusCode(200);
    request.setStsResponseBody({
        access_token: 'some_token'
    });
    request.setPersonStatusCode(500);

    expect(personLookup.hentPerson('12345')).rejects.toMatch(
        'Error during person lookup'
    );
});

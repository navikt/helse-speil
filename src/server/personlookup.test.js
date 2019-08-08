'use strict';

jest.mock('request');

const personLookup = require('../../src/server/personlookup');

beforeEach(() => {
    personLookup.init({
        serviceUserName: 'da_usah',
        serviceUserPassword: 'pazzwd',
        stsUrl: 'http://localhost'
    });
});

test('successful person lookup resolves with person object', () => {
    require('request').setStsStatusCode(200);
    require('request').setStsResponseBody({
        access_token: 'some_token'
    });
    require('request').setPersonStatusCode(200);
    require('request').setPersonResponseBody({ navn: 'Navn Navnesen' });

    expect(personLookup.hentPerson('12345')).resolves.toEqual({
        navn: 'Navn Navnesen'
    });
});

test('logon failure -> rejection', () => {
    require('request').setStsStatusCode(500);

    expect(personLookup.hentPerson('12345')).rejects.toMatch(
        'Error during STS login'
    );
});

test('lookup failure -> rejection', () => {
    require('request').setStsStatusCode(200);
    require('request').setStsResponseBody({
        access_token: 'some_token'
    });
    require('request').setPersonStatusCode(500);

    expect(personLookup.hentPerson('12345')).rejects.toMatch(
        'Error during person lookup'
    );
});

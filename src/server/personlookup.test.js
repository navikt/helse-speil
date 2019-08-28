'use strict';

jest.mock('request-promise-native');

const personLookup = require('../../src/server/personlookup');

const expectedPerson = {
    navn: 'BJARNE BETJENT',
    kjønn: 'MANN'
};

const validCreds = {
    serviceUserName: 'valid',
    serviceUserPassword: 'creds'
};

const bogusCreds = {
    serviceUserName: 'bogus',
    serviceUserPassword: 'creds'
};

test('successful person lookup resolves with mapped person object', () => {
    personLookup.init({
        stsUrl: 'http://localhost',
        ...validCreds
    });

    expect(personLookup.hentPerson('11111')).resolves.toEqual(expectedPerson);
});

test('logon failure -> rejection', () => {
    personLookup.init({
        stsUrl: 'http://localhost',
        ...bogusCreds
    });

    expect(personLookup.hentPerson('22222')).rejects.toMatch(
        'Error while retrieving access token'
    );
});

test('lookup failure -> rejection', () => {
    personLookup.init({
        stsUrl: 'http://localhost',
        ...validCreds
    });

    expect(personLookup.hentPerson('33333')).rejects.toMatch(
        'Error while finding person'
    );
});

'use strict';

jest.mock('request-promise-native');

const personLookup = require('./personlookup');

const expectedPerson = {
    fdato: '1995-01-01',
    statsborgerskap: 'NOR',
    etternavn: 'BETJENT',
    aktørId: '1000012345678',
    bostedsland: 'NOR',
    fornavn: 'BJARNE',
    kjønn: 'MANN',
    status: 'BOSA'
};

const validCreds = {
    serviceUserName: 'valid',
    serviceUserPassword: 'creds'
};

const bogusCreds = {
    serviceUserName: 'bogus',
    serviceUserPassword: 'creds'
};

test('successful lookup resolves with person object', () => {
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

    expect(personLookup.hentPerson('22222')).rejects.toMatch('wrong creds');
});

test('lookup failure -> rejection', () => {
    personLookup.init({
        stsUrl: 'http://localhost',
        ...validCreds
    });

    expect(personLookup.hentPerson('33333')).rejects.toMatch('request failed');
});

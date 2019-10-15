'use strict';

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

const stsclientStub = {
    hentAccessToken: () => Promise.resolve({})
};
const aktørIdLookupStub = {
    hentFnr: () => Promise.resolve(2469)
};

test('successful lookup resolves with person object', async () => {
    personLookup.init(stsclientStub, aktørIdLookupStub);

    await expect(personLookup.hentPerson('11111')).resolves.toEqual({
        ...expectedPerson,
        fnr: 2469
    });
});

test('lookup failure -> rejection', () => {
    personLookup.init(stsclientStub);

    expect(personLookup.hentPerson('22222')).rejects.toMatch('request failed');
});

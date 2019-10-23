'use strict';

const personinfolookup = require('./personinfolookup');

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
    personinfolookup.init(stsclientStub, aktørIdLookupStub);

    await expect(personinfolookup.hentPerson('11111')).resolves.toEqual({
        ...expectedPerson,
        fnr: 2469
    });
});

test('lookup failure -> rejection', async () => {
    personinfolookup.init(stsclientStub);

    await expect(personinfolookup.hentPerson('22222')).rejects.toMatch('request failed');
});

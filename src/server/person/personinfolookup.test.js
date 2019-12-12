'use strict';

const personinfolookupFactory = require('./personinfolookup');

const sparkelClient = require('../adapters/sparkelClient');

const personinfoAsInMockedResponsesFile = {
    fornavn: 'BJARNE'
};

jest.mock('./personinfomapping', () => ({
    map: person => ({ fornavnMappedByStub: person.fornavn, fnr: person.fnr })
}));

const stsclientStub = {
    hentAccessToken: () => Promise.resolve({})
};
const aktørIdLookupStub = {
    hentFnr: () => Promise.resolve(2469)
};

let personinfolookup;
beforeAll(() => {
    personinfolookup = personinfolookupFactory.build({
        sparkelClient,
        stsclient: stsclientStub,
        aktørIdLookup: aktørIdLookupStub
    });
});

test('successful lookup resolves with person object', async () => {
    await expect(personinfolookup.hentPersoninfo('11111')).resolves.toEqual({
        fornavnMappedByStub: personinfoAsInMockedResponsesFile.fornavn,
        fnr: 2469
    });
});

test('lookup failure -> rejection', async () => {
    await expect(personinfolookup.hentPersoninfo('22222')).rejects.toMatch('request failed');
});

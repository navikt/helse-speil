// @ts-nocheck
import personinfoLookup from './personinfoLookup';
import sparkelClient from '../adapters/sparkelClient';
import { StsClient } from '../auth/stsClient';
import { NavConfig } from '../types';

jest.mock('./personinfoMapping', () => ({
    map: person => ({ fornavnMappedByStub: person.fornavn, fnr: person.fnr })
}));

const stsClientStub = {
    init: (_config: NavConfig) => {},
    hentAccessToken: () => Promise.resolve('')
};
const aktørIdLookupStub = {
    hentFnr: (_aktørId: string) => Promise.resolve('2469'),
    hentAktørId: (_fnr: string) => Promise.resolve(''),
    init: (_stsClient: StsClient, _condig: NavConfig) => {}
};

beforeAll(() => {
    personinfoLookup.init({
        sparkelClient,
        stsClient: stsClientStub,
        aktørIdLookup: aktørIdLookupStub
    });
});

test('successful lookup resolves with person object', async () => {
    await expect(personinfoLookup.hentPersoninfo('11111')).resolves.toEqual({
        fornavnMappedByStub: 'BJARNE',
        fnr: '2469'
    });
});

test('lookup failure -> rejection', async () => {
    await expect(personinfoLookup.hentPersoninfo('22222')).rejects.toMatch('request failed');
});

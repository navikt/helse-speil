import personMapping from './personinfoMapping';

const sparkelResponse = {
    fdato: '1995-01-01',
    statsborgerskap: 'NOR',
    etternavn: 'BETJENT',
    aktørId: '1000012345678',
    bostedsland: 'NOR',
    fornavn: 'BJARNE',
    kjønn: 'MANN',
    status: 'BOSA',
};

const aktørregisterResponse = '12045632100';

const inputTilMapper = { ...sparkelResponse, fnr: aktørregisterResponse };

const expectedPerson = {
    kjønn: 'MANN',
    fødselsdato: '1995-01-01',
    fnr: aktørregisterResponse,
};

test('person mapper maps person correctly', () => {
    expect(personMapping.map(inputTilMapper)).toEqual(expectedPerson);
});

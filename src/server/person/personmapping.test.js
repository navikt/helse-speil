'use strict';

const personMapping = require('./personmapping');

const origPerson = {
    fdato: '1995-01-01',
    statsborgerskap: 'NOR',
    etternavn: 'BETJENT',
    aktørId: '1000012345678',
    bostedsland: 'NOR',
    fornavn: 'BJARNE',
    kjønn: 'MANN',
    status: 'BOSA'
};

const expectedPerson = { kjønn: 'MANN', navn: 'BJARNE BETJENT' };

test('successful person lookup resolves with mapped person object', () => {
    expect(personMapping.map(origPerson)).toEqual(expectedPerson);
});

'use strict';

import 'jest-dom/extend-expect';

const fs = require('fs');

const mapping = require('../../src/server/mapping');

const readTestdata = () => {
    return fs.readFileSync('__mock-data__/behandlinger.json').toString();
};

test('medlemsskap', async () => {
    const rawServerResponse = JSON.parse(readTestdata());
    const medlemsskap = mapping.inngangsvilkår(
        rawServerResponse.behandlinger[0]
    ).medlemsskap;
    const expected = {
        bostedsland: 'NOR'
    };
    expect(medlemsskap).toEqual(expected);
});

test('opptjening', async () => {
    const rawServerResponse = JSON.parse(readTestdata());
    const opptjening = mapping.inngangsvilkår(rawServerResponse.behandlinger[0])
        .opptjening;
    const expected = {
        førsteSykdomsdag: new Date(Date.parse('2019-02-03')),
        antallDager: 398,
        startdato: new Date('2018-01-01'),
        sluttdato: null
    };
    expect(opptjening).toEqual(expected);
});

test('inntekt', async () => {
    const rawServerResponse = JSON.parse(readTestdata());
    const mapped = mapping.inngangsvilkår(rawServerResponse.behandlinger[0])
        .inntekt;
    const expected = {
        beløp: 300000
    };
    expect(mapped).toEqual(expected);
});

test('søknadsfrist', async () => {
    const rawServerResponse = JSON.parse(readTestdata());
    const mapped = mapping.inngangsvilkår(rawServerResponse.behandlinger[0])
        .søknadsfrist;
    const expected = {
        sendtNav: new Date('2019-03-14T09:17:55.459'),
        sisteSykdomsdag: new Date('2019-03-16'),
        antallMnd: 0
    };
    expect(mapped).toEqual(expected);
});

test('dagerIgjen', async () => {
    const rawServerResponse = JSON.parse(readTestdata());
    const mapped = mapping.inngangsvilkår(rawServerResponse.behandlinger[0])
        .dagerIgjen;
    const expected = {
        førsteFraværsdag: new Date('2019-02-03'),
        førsteSykepengedag: new Date('2019-02-22'),
        alder: 37,
        yrkesstatus: 'ARBEIDSTAKER',
        maxDato: new Date('2020-02-04'),
        tidligerePerioder: []
    };
    expect(mapped).toEqual(expected);
});

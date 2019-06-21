'use strict';

import 'jest-dom/extend-expect';

const fs = require('fs');

const mapping = require('../../src/server/mapping');

const readTestdata = () => {
    return fs.readFileSync('__mock-data__/behandlinger.json').toString();
};

test('medlemskap', async () => {
    const rawServerResponse = JSON.parse(readTestdata());
    const medlemskap = mapping.inngangsvilkår(rawServerResponse.behandlinger[0])
        .medlemskap;
    const expected = {
        bostedsland: 'NOR'
    };
    expect(medlemskap).toEqual(expected);
});

test('opptjening', async () => {
    const rawServerResponse = JSON.parse(readTestdata());
    const opptjening = mapping.inngangsvilkår(rawServerResponse.behandlinger[0])
        .opptjening;
    const expected = {
        førsteSykdomsdag: new Date(Date.parse('2019-05-09')),
        antallDager: 768,
        startdato: new Date('2017-04-01'),
        sluttdato: null
    };
    expect(opptjening).toEqual(expected);
});

test('inntekt', async () => {
    const rawServerResponse = JSON.parse(readTestdata());
    const mapped = mapping.inngangsvilkår(rawServerResponse.behandlinger[0])
        .inntekt;
    const expected = {
        beløp: 416820
    };
    expect(mapped).toEqual(expected);
});

test('søknadsfrist', async () => {
    const rawServerResponse = JSON.parse(readTestdata());
    const mapped = mapping.inngangsvilkår(rawServerResponse.behandlinger[0])
        .søknadsfrist;
    const expected = {
        sendtNav: new Date('2019-06-11T17:21:29.127'),
        sisteSykdomsdag: new Date('2019-05-26'),
        innen3Mnd: true
    };
    expect(mapped).toEqual(expected);
});

test('dagerIgjen', async () => {
    const rawServerResponse = JSON.parse(readTestdata());
    const mapped = mapping.inngangsvilkår(rawServerResponse.behandlinger[0])
        .dagerIgjen;
    const expected = {
        førsteFraværsdag: new Date('2019-05-09'),
        førsteSykepengedag: new Date('2019-05-09'),
        alder: 42,
        yrkesstatus: 'ARBEIDSTAKER',
        maxDato: new Date('2020-04-20'),
        tidligerePerioder: []
    };
    expect(mapped).toEqual(expected);
});

test('originalSøknad', async () => {
    const rawServerResponse = JSON.parse(readTestdata());
    const mapped = mapping.originalSøknad(rawServerResponse.behandlinger[0]);
    const expected = {
        arbeidsgiver: {
            navn: 'S. VINDEL & SØNN',
            orgnummer: '999999999'
        },
        aktorId: '12345678910112',
        soknadsperioder: [
            { sykmeldingsgrad: 100 }
        ],
        fom: new Date('2019-05-09T00:00:00.000Z'),
        tom: new Date('2019-05-26T00:00:00.000Z')
    };
    expect(mapped).toEqual(expected);
});

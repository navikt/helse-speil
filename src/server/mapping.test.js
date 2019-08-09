'use strict';

import '@testing-library/jest-dom/extend-expect';

const fs = require('fs');

const mapping = require('./mapping');

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
        førsteSykdomsdag: '2019-05-09',
        antallDager: 768,
        startdato: '2017-04-01',
        sluttdato: null
    };
    expect(opptjening).toEqual(expected);
});

test('opptjening grunnlag may be missing, startdato and sluttdato will not be set', async () => {
    let behandling = JSON.parse(readTestdata()).behandlinger[0];
    behandling.avklarteVerdier.opptjeningstid.grunnlag.arbeidsforhold.grunnlag = undefined;
    const opptjening = mapping.inngangsvilkår(behandling).opptjening;
    const expected = {
        førsteSykdomsdag: '2019-05-09',
        antallDager: 768,
        startdato: undefined,
        sluttdato: undefined
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
        sendtNav: '2019-06-11T17:21:29.127',
        sisteSykdomsdag: '2019-05-26',
        innen3Mnd: true
    };
    expect(mapped).toEqual(expected);
});

test('dagerIgjen', async () => {
    const rawServerResponse = JSON.parse(readTestdata());
    const mapped = mapping.inngangsvilkår(rawServerResponse.behandlinger[0])
        .dagerIgjen;
    const expected = {
        førsteFraværsdag: '2019-05-09',
        førsteSykepengedag: '2019-05-09',
        alder: 42,
        yrkesstatus: 'ARBEIDSTAKER',
        maxDato: '2020-04-20',
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
        soknadsperioder: [{ sykmeldingsgrad: 100 }],
        fom: '2019-05-09',
        tom: '2019-05-26'
    };
    expect(mapped).toEqual(expected);
});

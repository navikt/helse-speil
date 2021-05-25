import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { SpesialistArbeidsgiver, SpleisVedtaksperiodetilstand } from 'external-types';
import { Arbeidsgiver, Dagtype, Person, Vedtaksperiode } from 'internal-types';
import React from 'react';
import { mappetPerson } from 'test-data';

import { VedtaksperiodeBuilder } from '../../../mapping/vedtaksperiode';

import { umappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';
import { Sykmeldingsperiodetabell } from './Sykmeldingsperiodetabell';

const enIkkeUtbetaltVedtaksperiode = () => {
    const { vedtaksperiode } = new VedtaksperiodeBuilder()
        .setVedtaksperiode(umappetVedtaksperiode())
        .setArbeidsgiver({ organisasjonsnummer: '123456789' } as SpesialistArbeidsgiver)
        .setOverstyringer([])
        .build();
    return vedtaksperiode as Vedtaksperiode;
};

const enUtbetaltVedtaksperiode = () => {
    const { vedtaksperiode } = new VedtaksperiodeBuilder()
        .setVedtaksperiode({ ...umappetVedtaksperiode(), tilstand: SpleisVedtaksperiodetilstand.Utbetalt })
        .setArbeidsgiver({ organisasjonsnummer: '123456789' } as SpesialistArbeidsgiver)
        .setOverstyringer([])
        .build();
    return vedtaksperiode as Vedtaksperiode;
};

const enVedtaksperiodeMedArbeidsdagIForkant = (): Vedtaksperiode => {
    const vedtaksperiode = enUtbetaltVedtaksperiode();
    vedtaksperiode.sykdomstidslinje[0].type = Dagtype.Arbeidsdag;
    return vedtaksperiode;
};

const enVedtaksperiodeMedArbeidsdag = (): Vedtaksperiode => {
    const vedtaksperiode = enUtbetaltVedtaksperiode();
    vedtaksperiode.sykdomstidslinje[1].type = Dagtype.Arbeidsdag;
    return vedtaksperiode;
};

const renderSykmeldingsperiodetabell = (vedtaksperiode: Vedtaksperiode, person: Person = mappetPerson()) =>
    render(<Sykmeldingsperiodetabell person={person} vedtaksperiode={vedtaksperiode} toggleOverstyring={() => true} />);

describe('Sykmeldingsperiodetabell', () => {
    test('rendrer Sykmeldingsperiode- og Graderingskolonne', () => {
        renderSykmeldingsperiodetabell(enUtbetaltVedtaksperiode());
        expect(screen.getByText('Dato')).toBeVisible();
        expect(screen.getByText('Grad')).toBeVisible();
    });
    test('rendrer endreknapp ved ikke utbetalt vedtaksperiode', () => {
        renderSykmeldingsperiodetabell(enIkkeUtbetaltVedtaksperiode());
        expect(screen.getByText('Endre')).toBeVisible();
    });
    test('rendrer ikke endreknapp ved ikke utbetalt vedtaksperiode', async () => {
        renderSykmeldingsperiodetabell(enUtbetaltVedtaksperiode());
        expect(screen.queryByText('Endre')).toBeNull();
    });
    test('rendrer ikke endreknapp ved flere arbeidsgivere', async () => {
        const person = { arbeidsgivere: [{} as Arbeidsgiver, {} as Arbeidsgiver] } as Person;
        renderSykmeldingsperiodetabell(enIkkeUtbetaltVedtaksperiode(), person);
        expect(screen.queryByText('Endre')).toBeNull();
    });
    test('rendrer ikke arbeidsdager i begynnelsen av perioden', async () => {
        const person = { arbeidsgivere: [{} as Arbeidsgiver, {} as Arbeidsgiver] } as Person;
        renderSykmeldingsperiodetabell(enVedtaksperiodeMedArbeidsdagIForkant(), person);
        expect(screen.queryByText('Arbeidsdag')).toBeNull();
    });
    test('rendrer arbeidsdager i midten av perioden', async () => {
        const person = { arbeidsgivere: [{} as Arbeidsgiver, {} as Arbeidsgiver] } as Person;
        renderSykmeldingsperiodetabell(enVedtaksperiodeMedArbeidsdag(), person);
        expect(screen.queryByText('Arbeidsdag')).toBeVisible();
    });
});

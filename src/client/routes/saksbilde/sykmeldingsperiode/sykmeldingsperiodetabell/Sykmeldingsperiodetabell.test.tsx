import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs, { Dayjs } from 'dayjs';
import { SpesialistArbeidsgiver, SpleisVedtaksperiodetilstand } from 'external-types';
import { Arbeidsgiver, Dagtype, Person, Vedtaksperiode } from 'internal-types';
import React from 'react';
import { mappetPerson } from 'test-data';

import { Tidslinjetilstand } from '../../../../mapping/arbeidsgiver';
import { VedtaksperiodeBuilder } from '../../../../mapping/vedtaksperiode';
import { Periodetype, Tidslinjeperiode } from '../../../../modell/UtbetalingshistorikkElement';

import { umappetVedtaksperiode } from '../../../../../test/data/vedtaksperiode';
import { Sykmeldingsperiodetabell } from './Sykmeldingsperiodetabell';

const enTidslinjeperiode = (
    tilstand: Tidslinjetilstand = Tidslinjetilstand.Oppgaver,
    fom: Dayjs = dayjs('2021-01-01'),
    tom: Dayjs = dayjs('2021-01-31'),
    periodetype: Periodetype = Periodetype.VEDTAKSPERIODE
): Tidslinjeperiode => {
    return {
        id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
        beregningId: 'id1',
        unique: 'unique_id',
        fom: fom,
        tom: tom,
        type: periodetype,
        tilstand: tilstand,
        utbetalingstidslinje: [],
        sykdomstidslinje: [],
        organisasjonsnummer: '123456789',
        fullstendig: true,
        opprettet: dayjs('2020-01-01T:00:00:00'),
    };
};

const enIkkeUtbetaltVedtaksperiode = () => {
    const { vedtaksperiode } = new VedtaksperiodeBuilder()
        .setVedtaksperiode(umappetVedtaksperiode())
        .setArbeidsgiver({ organisasjonsnummer: '123456789' } as SpesialistArbeidsgiver)
        .setAnnullertUtbetalingshistorikk([])
        .setOverstyringer([])
        .build();
    return vedtaksperiode as Vedtaksperiode;
};

const enUtbetaltVedtaksperiode = () => {
    const { vedtaksperiode } = new VedtaksperiodeBuilder()
        .setVedtaksperiode({ ...umappetVedtaksperiode(), tilstand: SpleisVedtaksperiodetilstand.Utbetalt })
        .setArbeidsgiver({ organisasjonsnummer: '123456789' } as SpesialistArbeidsgiver)
        .setAnnullertUtbetalingshistorikk([])
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

const renderSykmeldingsperiodetabell = (
    vedtaksperiode: Vedtaksperiode,
    aktivPeriode = enTidslinjeperiode(),
    person: Person = mappetPerson()
) =>
    render(
        <Sykmeldingsperiodetabell
            person={person}
            aktivPeriode={aktivPeriode}
            vedtaksperiode={vedtaksperiode}
            toggleOverstyring={() => true}
        />
    );

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
    test('rendrer revurderknapp ved utbetalt vedtaksperiode', async () => {
        const person = mappetPerson();
        renderSykmeldingsperiodetabell(
            enUtbetaltVedtaksperiode(),
            person.arbeidsgivere[0].tidslinjeperioder[0][0],
            person
        );
        expect(screen.queryByText('Revurder')).toBeVisible();
    });
    test('rendrer ikke endreknapp ved flere arbeidsgivere', async () => {
        const person = { arbeidsgivere: [{} as Arbeidsgiver, {} as Arbeidsgiver] } as Person;
        renderSykmeldingsperiodetabell(enIkkeUtbetaltVedtaksperiode(), enTidslinjeperiode(), person);
        expect(screen.queryByText('Endre')).toBeNull();
    });
    test('rendrer ikke arbeidsdager i begynnelsen av perioden', async () => {
        const person = { arbeidsgivere: [{} as Arbeidsgiver, {} as Arbeidsgiver] } as Person;
        renderSykmeldingsperiodetabell(enVedtaksperiodeMedArbeidsdagIForkant(), enTidslinjeperiode(), person);
        expect(screen.queryByText('Arbeidsdag')).toBeNull();
    });
    test('rendrer arbeidsdager i midten av perioden', async () => {
        const person = { arbeidsgivere: [{} as Arbeidsgiver, {} as Arbeidsgiver] } as Person;
        renderSykmeldingsperiodetabell(enVedtaksperiodeMedArbeidsdag(), enTidslinjeperiode(), person);
        expect(screen.queryByText('Arbeidsdag')).toBeVisible();
    });
});

import React from 'react';
import { mappetPerson } from 'test-data';
import { Dagtype, Person, Vedtaksperiode } from 'internal-types';
import { render, screen } from '@testing-library/react';
import { defaultPersonContext, PersonContext } from '../../../context/PersonContext';
import {
    totaltAntallUtbetalingsdager,
    totalUtbetaling,
    Utbetalingsoversikt,
    vedtaksperiodeDagerIgjen,
} from './Utbetalingsoversikt';
import { medUtbetalingstidslinje, umappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';
import { umappetArbeidsgiver } from '../../../../test/data/arbeidsgiver';
import { SpleisUtbetalingsdagtype } from 'external-types';
import { mapVedtaksperiode } from '../../../mapping/vedtaksperiode';
import '@testing-library/jest-dom/extend-expect';
import dayjs from 'dayjs';

const enIkkeUtbetaltVedtaksperiode = () =>
    mapVedtaksperiode({
        ...umappetVedtaksperiode(),
        organisasjonsnummer: '123456789',
        overstyringer: [],
    });

describe('Utbetalingsoversikt', () => {
    test('Totalutbetaling blir 0 uten vedtaksperiode', () => {
        const vedtaksperiode = undefined;
        const utbetaling = totalUtbetaling(vedtaksperiode);
        expect(utbetaling).toBe(0);
    });

    test('Totalutbetaling regner ut riktig beløp', async () => {
        const vedtaksperiode = await enIkkeUtbetaltVedtaksperiode();
        const utbetaling = totalUtbetaling(vedtaksperiode);
        expect(utbetaling).toBe(34500);
    });

    test('Totalutbetaling regner ut riktig beløp ved en avvist dagtype', async () => {
        const vedtaksperiode = await enIkkeUtbetaltVedtaksperiode();
        vedtaksperiode.utbetalingstidslinje[0].type = Dagtype.Avvist;
        const utbetaling = totalUtbetaling(vedtaksperiode);
        expect(utbetaling).toBe(33000);
    });

    test('Totalutbetalingsdager blir 0 uten vedtaksperiode', () => {
        const vedtaksperiode = undefined;
        const utbetalingsdager = totaltAntallUtbetalingsdager(vedtaksperiode);
        expect(utbetalingsdager).toBe(0);
    });

    test('Totalutbetalingsdager regner ut riktig antall dager', async () => {
        const vedtaksperiode = await enIkkeUtbetaltVedtaksperiode();
        const utbetalingsdager = totaltAntallUtbetalingsdager(vedtaksperiode);
        expect(utbetalingsdager).toBe(23);
    });

    test('Totalutbetalingsdager regner ut riktig antall dager ved en avvist dag', async () => {
        const vedtaksperiode = await enIkkeUtbetaltVedtaksperiode();
        vedtaksperiode.utbetalingstidslinje[0].type = Dagtype.Avvist;
        const utbetalingsdager = totaltAntallUtbetalingsdager(vedtaksperiode);
        expect(utbetalingsdager).toBe(22);
    });

    test('Dager igjen per dato i en vedtaksperiode er en tom liste dersom vedtaksperiode ikke er satt', () => {
        const vedtaksperiode = undefined;
        const dagerIgjen = vedtaksperiodeDagerIgjen(vedtaksperiode);
        expect(dagerIgjen).toStrictEqual([]);
    });

    test('Dager igjen per dato i en vedtaksperiode regnes riktig dersom maksdato har vært og gjenstående dager er 0', async () => {
        const vedtaksperiode = await enIkkeUtbetaltVedtaksperiode();
        vedtaksperiode.vilkår!!.dagerIgjen.gjenståendeDager = 0;
        vedtaksperiode.vilkår!!.dagerIgjen.maksdato = dayjs('2019-12-31');
        const dagerIgjen = vedtaksperiodeDagerIgjen(vedtaksperiode);
        expect(dagerIgjen[0]).toBe(0);
        expect(dagerIgjen[30]).toBe(0);
    });

    test('Dager igjen per dato i en vedtaksperiode regnes ut riktig for en vedtaksperiode', async () => {
        const vedtaksperiode = await enIkkeUtbetaltVedtaksperiode();
        vedtaksperiode.vilkår!!.dagerIgjen.gjenståendeDager = 50;
        const dagerIgjen = vedtaksperiodeDagerIgjen(vedtaksperiode);
        expect(dagerIgjen[0]).toBe(72);
        expect(dagerIgjen[1]).toBe(71);
        expect(dagerIgjen[30]).toBe(50);
        expect(dagerIgjen[30]).toBe(vedtaksperiode.vilkår?.dagerIgjen.gjenståendeDager);
    });

    test('Dager igjen per dato i en vedtaksperiode regnes ut riktig for en vedtaksperiode med en avvist dag', async () => {
        const vedtaksperiode = await enIkkeUtbetaltVedtaksperiode();
        vedtaksperiode.vilkår!!.dagerIgjen.gjenståendeDager = 50;
        vedtaksperiode.utbetalingstidslinje[1].type = Dagtype.Avvist;
        const dagerIgjen = vedtaksperiodeDagerIgjen(vedtaksperiode);
        expect(dagerIgjen[0]).toBe(71);
        expect(dagerIgjen[1]).toBe(71);
        expect(dagerIgjen[30]).toBe(50);
    });

    it('Alle dager er godkjent', async () => {
        const person = await mappetPerson();
        await renderUtbetalingsoversikt(person);

        expect(screen.queryAllByText('Ingen utbetaling')).toStrictEqual([]);
        expect(screen.queryAllByText('100%').length).toBe(23);
    });

    it('2 dager er avvist', async () => {
        const person = await mappetPerson([
            umappetArbeidsgiver([
                medUtbetalingstidslinje(umappetVedtaksperiode(), [
                    {
                        type: SpleisUtbetalingsdagtype.NAVDAG,
                        inntekt: 999.5,
                        dato: '2020-01-01',
                        utbetaling: 1000.0,
                        grad: 100,
                    },
                    {
                        type: SpleisUtbetalingsdagtype.AVVISTDAG,
                        inntekt: 999.5,
                        dato: '2020-01-02',
                        utbetaling: 0.0,
                        begrunnelse: 'MinimumSykdomsgrad',
                        grad: 0,
                    },
                    {
                        type: SpleisUtbetalingsdagtype.AVVISTDAG,
                        inntekt: 999.5,
                        dato: '2020-01-03',
                        utbetaling: 0.0,
                        begrunnelse: 'EtterDødsdato',
                        grad: 0,
                    },
                ]),
            ]),
        ]);
        await renderUtbetalingsoversikt(person);

        expect(screen.queryAllByText('Ingen utbetaling').length).toStrictEqual(2);
        expect(screen.queryAllByText('Personen er død').length).toStrictEqual(1);
        expect(screen.queryAllByText('§ 8-13 Krav til nedsatt arbeidsevne er ikke oppfylt').length).toStrictEqual(1);
        expect(screen.queryAllByText('100%').length).toStrictEqual(1);
        expect(screen.queryAllByText('0%').length).toStrictEqual(2);
        expect(screen.queryAllByText('1 000,00 kr').length).toStrictEqual(2);
    });
});

const renderUtbetalingsoversikt = (person: Person) =>
    render(
        <PersonContext.Provider
            value={{
                ...defaultPersonContext,
                personTilBehandling: person,
                aktivVedtaksperiode: person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode,
            }}
        >
            <Utbetalingsoversikt />
        </PersonContext.Provider>
    );

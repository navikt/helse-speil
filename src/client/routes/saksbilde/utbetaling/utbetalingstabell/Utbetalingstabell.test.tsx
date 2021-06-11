import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { SpleisUtbetalingsdagtype } from 'external-types';
import { Dagtype, Utbetalingsdag, Vedtaksperiode } from 'internal-types';
import React from 'react';
import { mappetPerson } from 'test-data';

import { umappetArbeidsgiver } from '../../../../../test/data/arbeidsgiver';
import {
    mappetVedtaksperiode,
    medUtbetalingstidslinje,
    umappetVedtaksperiode,
} from '../../../../../test/data/vedtaksperiode';
import { Utbetalingstabell } from './Utbetalingstabell';
import { withDagerIgjen } from './Utbetalingstabell.utils';

describe('Utbetalingsoversikt', () => {
    test('withDagerIgjen mapper ut tom liste ved mottatt tom liste', async () => {
        const utbetalingsdager = withDagerIgjen([], 6).map((it) => it.dagerIgjen);
        expect(utbetalingsdager).toEqual([]);
    });

    test('withDagerIgjen mapper ut riktig antall i dagerIgjen-propertyen', async () => {
        const tidslinje = [
            { type: Dagtype.Syk },
            { type: Dagtype.Avvist },
            { type: Dagtype.Syk },
            { type: Dagtype.Helg },
            { type: Dagtype.Helg },
            { type: Dagtype.Syk },
            { type: Dagtype.Syk },
            { type: Dagtype.Egenmelding },
            { type: Dagtype.Syk },
            { type: Dagtype.Syk },
            { type: Dagtype.Syk },
            { type: Dagtype.Syk },
            { type: Dagtype.Syk },
        ] as Utbetalingsdag[];
        const utbetalingsdager = withDagerIgjen(tidslinje, 6).map((it) => it.dagerIgjen);
        expect(utbetalingsdager).toEqual([5, 5, 4, 4, 4, 3, 2, 2, 1, 0, 0, 0, 0]);
    });

    it('Alle dager er godkjent', async () => {
        const vedtaksperiode = mappetVedtaksperiode();
        const periode = { fom: vedtaksperiode.fom, tom: vedtaksperiode.tom };
        const utbetalingstidslinje = vedtaksperiode.utbetalingstidslinje;
        const sykdomstidslinje = vedtaksperiode.sykdomstidslinje;
        const { maksdato, gjenståendeDager } = vedtaksperiode.vilkår!!.dagerIgjen;
        render(
            <Utbetalingstabell
                utbetalingstidslinje={utbetalingstidslinje}
                sykdomstidslinje={sykdomstidslinje}
                maksdato={maksdato}
                gjenståendeDager={gjenståendeDager}
                periode={periode}
            />
        );

        expect(screen.queryAllByText('Ingen utbetaling')).toStrictEqual([]);
        expect(screen.queryAllByText('100 %').length).toBe(23);
    });

    it('Alle kolonnene i tabellen er til stede', async () => {
        const vedtaksperiode = mappetVedtaksperiode();
        const periode = { fom: vedtaksperiode.fom, tom: vedtaksperiode.tom };
        const utbetalingstidslinje = vedtaksperiode.utbetalingstidslinje;
        const sykdomstidslinje = vedtaksperiode.sykdomstidslinje;
        const { maksdato, gjenståendeDager } = vedtaksperiode.vilkår!!.dagerIgjen;

        render(
            <Utbetalingstabell {...{ utbetalingstidslinje, sykdomstidslinje, maksdato, gjenståendeDager, periode }} />
        );
        expect(screen.queryByText('Dato')).toBeVisible();
        expect(screen.queryByText('Utbet. dager')).toBeVisible();
        expect(screen.queryByText('Grad')).toBeVisible();
        expect(screen.queryByText('Total grad')).toBeVisible();
        expect(screen.queryByText('Utbetaling')).toBeVisible();
        expect(screen.queryByText('Dager igjen')).toBeVisible();
    });

    it('2 dager er avvist', async () => {
        const vedtaksperiode = mappetPerson([
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
                        begrunnelser: ['MinimumSykdomsgrad'],
                        grad: 0,
                    },
                    {
                        type: SpleisUtbetalingsdagtype.AVVISTDAG,
                        inntekt: 999.5,
                        dato: '2020-01-03',
                        utbetaling: 0.0,
                        begrunnelser: ['EtterDødsdato'],
                        grad: 0,
                    },
                ]),
            ]),
        ]).arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode;

        const periode = { fom: vedtaksperiode.fom, tom: vedtaksperiode.tom };
        const utbetalingstidslinje = vedtaksperiode.utbetalingstidslinje;
        const sykdomstidslinje = vedtaksperiode.sykdomstidslinje;
        const { maksdato, gjenståendeDager } = vedtaksperiode.vilkår!!.dagerIgjen;

        render(
            <Utbetalingstabell
                {...{
                    sykdomstidslinje,
                    utbetalingstidslinje,
                    maksdato,
                    gjenståendeDager,
                    periode,
                }}
            />
        );

        expect(screen.queryByText('Personen er død')).toBeVisible();
        expect(screen.queryByText('8-13', { exact: false })).toBeVisible();
        expect(screen.queryByText('100 %')).toBeVisible();
    });
});

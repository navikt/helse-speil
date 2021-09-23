import { renderHook } from '@testing-library/react-hooks';
import dayjs from 'dayjs';
import React from 'react';

import { antallSykedagerTilOgMedMaksdato, useTabelldagerMap, withDagerIgjen } from './useTabelldagerMap';

const dager: Dag[] = [
    { dato: dayjs('2021-01-01'), type: 'Syk' },
    { dato: dayjs('2021-01-02'), type: 'Avslått' },
    { dato: dayjs('2021-01-03'), type: 'Syk' },
    { dato: dayjs('2021-01-04'), type: 'Helg' },
    { dato: dayjs('2021-01-05'), type: 'Helg' },
    { dato: dayjs('2021-01-06'), type: 'Syk' },
    { dato: dayjs('2021-01-07'), type: 'Syk' },
    { dato: dayjs('2021-01-08'), type: 'Egenmelding' },
    { dato: dayjs('2021-01-09'), type: 'Syk' },
    { dato: dayjs('2021-01-10'), type: 'Syk' },
    { dato: dayjs('2021-01-11'), type: 'Syk' },
    { dato: dayjs('2021-01-12'), type: 'Syk' },
    { dato: dayjs('2021-01-13'), type: 'Syk' },
];

describe('withDagerIgjen', () => {
    it('returnerer tom liste', () => {
        const utbetalingsdager = withDagerIgjen([], 6).map((it) => it.dagerIgjen);
        expect(utbetalingsdager).toHaveLength(0);
    });

    it('mapper ut riktig antall dager igjen', () => {
        const utbetalingsdager = withDagerIgjen(dager, 6).map((it) => it.dagerIgjen);
        expect(utbetalingsdager).toEqual([5, 5, 4, 4, 4, 3, 2, 2, 1, 0, 0, 0, 0]);
    });
});

describe('antallSykedagerTilOgMedMaksdato', () => {
    it('returnerer antall sykedager t.o.m. maksdato', () => {
        expect(antallSykedagerTilOgMedMaksdato(dager, dayjs('2021-01-11'))).toEqual(7);
        expect(antallSykedagerTilOgMedMaksdato(dager, dayjs('2021-01-04'))).toEqual(2);
        expect(antallSykedagerTilOgMedMaksdato(dager, dayjs('2021-01-31'))).toEqual(9);
        expect(antallSykedagerTilOgMedMaksdato(dager, dayjs('2020-01-01'))).toEqual(0);
    });
});

describe('useTabelldagerMap', () => {
    it('returnerer et map med utbetalingsdager', () => {
        const periode = {
            utbetalingstidslinje: dager,
            sykdomstidslinje: dager,
        } as Tidslinjeperiode;

        const { result } = renderHook(() => useTabelldagerMap(periode, [], 100, dayjs()));

        expect(result.current.get('01.01.2021')?.type).toEqual('Syk');
        expect(result.current.get('02.01.2021')?.type).toEqual('Avslått');
        expect(result.current.get('08.01.2021')?.type).toEqual('Egenmelding');
    });

    it('mapper overstyringer', () => {
        const periode = {
            utbetalingstidslinje: dager,
            sykdomstidslinje: dager,
        } as Tidslinjeperiode;

        const timestamp = dayjs();
        const overstyringer: Overstyring[] = [
            {
                hendelseId: 'en-id',
                timestamp,
                begrunnelse: 'Fordi',
                overstyrteDager: [{ dato: dayjs('2021-01-02'), type: 'Syk', grad: 80 }],
                saksbehandlerIdent: 'en-ident',
                saksbehandlerNavn: 'et-navn',
            },
        ];

        const { result } = renderHook(() => useTabelldagerMap(periode, overstyringer, 100, dayjs()));

        expect(result.current.get('01.01.2021')?.overstyringer).toBeUndefined();
        expect(result.current.get('02.01.2021')?.overstyringer?.[0].begrunnelse).toEqual('Fordi');
        expect(result.current.get('02.01.2021')?.overstyringer?.[0].timestamp.isSame(timestamp)).toEqual(true);
        expect(result.current.get('02.01.2021')?.overstyringer?.[0].ident).toEqual('en-ident');
        expect(result.current.get('02.01.2021')?.overstyringer?.[0].navn).toEqual('et-navn');
    });
});

import { renderHook } from '@testing-library/react-hooks';
import dayjs from 'dayjs';
import { Dagtype, Overstyring } from 'internal-types';
import React from 'react';

import { Tidslinjeperiode } from '../../../../modell/utbetalingshistorikkelement';

import { antallSykedagerTilOgMedMaksdato, useTabelldagerMap, withDagerIgjen } from './useTabelldagerMap';

const dager = [
    { dato: dayjs('2021-01-01'), type: Dagtype.Syk },
    { dato: dayjs('2021-01-02'), type: Dagtype.Avvist },
    { dato: dayjs('2021-01-03'), type: Dagtype.Syk },
    { dato: dayjs('2021-01-04'), type: Dagtype.Helg },
    { dato: dayjs('2021-01-05'), type: Dagtype.Helg },
    { dato: dayjs('2021-01-06'), type: Dagtype.Syk },
    { dato: dayjs('2021-01-07'), type: Dagtype.Syk },
    { dato: dayjs('2021-01-08'), type: Dagtype.Egenmelding },
    { dato: dayjs('2021-01-09'), type: Dagtype.Syk },
    { dato: dayjs('2021-01-10'), type: Dagtype.Syk },
    { dato: dayjs('2021-01-11'), type: Dagtype.Syk },
    { dato: dayjs('2021-01-12'), type: Dagtype.Syk },
    { dato: dayjs('2021-01-13'), type: Dagtype.Syk },
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

        expect(result.current.get('01.01.2021')?.type).toEqual(Dagtype.Syk);
        expect(result.current.get('02.01.2021')?.type).toEqual(Dagtype.Avvist);
        expect(result.current.get('08.01.2021')?.type).toEqual(Dagtype.Egenmelding);
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
                overstyrteDager: [{ dato: dayjs('2021-01-02'), type: Dagtype.Syk, grad: 80 }],
                saksbehandlerIdent: 'en-ident',
                saksbehandlerNavn: 'et-navn',
            },
        ];

        const { result } = renderHook(() => useTabelldagerMap(periode, overstyringer, 100, dayjs()));

        expect(result.current.get('01.01.2021')?.overstyring).toBeUndefined();
        expect(result.current.get('02.01.2021')?.overstyring?.begrunnelse).toEqual('Fordi');
        expect(result.current.get('02.01.2021')?.overstyring?.timestamp.isSame(timestamp)).toBeTruthy();
        expect(result.current.get('02.01.2021')?.overstyring?.ident).toEqual('en-ident');
        expect(result.current.get('02.01.2021')?.overstyring?.navn).toEqual('et-navn');
    });
});

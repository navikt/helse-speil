import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import React from 'react';

import { Dag, Dagoverstyring, Dagtype, Kildetype, Sykdomsdagtype, Utbetalingsdagtype } from '@io/graphql';
import { renderHook } from '@testing-library/react';

import { antallSykedagerTilOgMedMaksdato, createDagerMap, useTabelldagerMap } from './useTabelldagerMap';

dayjs.extend(isSameOrBefore);

const getDag = (dato: DateString, overrides?: Partial<Dag>): Dag => ({
    dato: dato,
    kilde: { id: 'en-id', type: Kildetype.Inntektsmelding },
    sykdomsdagtype: Sykdomsdagtype.Sykedag,
    utbetalingsdagtype: Utbetalingsdagtype.Navdag,
    ...overrides,
});

const dager: Dag[] = [
    getDag('2021-01-01'),
    getDag('2021-01-02', { utbetalingsdagtype: Utbetalingsdagtype.AvvistDag }),
    getDag('2021-01-03'),
    getDag('2021-01-04', { utbetalingsdagtype: Utbetalingsdagtype.Helgedag }),
    getDag('2021-01-05', { utbetalingsdagtype: Utbetalingsdagtype.Helgedag }),
    getDag('2021-01-06'),
    getDag('2021-01-07'),
    getDag('2021-01-08'),
    getDag('2021-01-09'),
    getDag('2021-01-10'),
    getDag('2021-01-11'),
    getDag('2021-01-12'),
    getDag('2021-01-13'),
];

describe('createDagerMap', () => {
    it('mapper ut riktig antall dager igjen', () => {
        const dagerMap = createDagerMap(dager, 6);
        const utbetalingsdager = Array.from(dagerMap.values()).map((it) => it.dagerIgjen);
        expect(utbetalingsdager).toEqual([5, 5, 4, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0]);
    });
});

describe('antallSykedagerTilOgMedMaksdato', () => {
    it('returnerer antall sykedager t.o.m. maksdato', () => {
        expect(antallSykedagerTilOgMedMaksdato(dager, '2021-01-11')).toEqual(8);
        expect(antallSykedagerTilOgMedMaksdato(dager, '2021-01-04')).toEqual(2);
        expect(antallSykedagerTilOgMedMaksdato(dager, '2021-01-31')).toEqual(10);
        expect(antallSykedagerTilOgMedMaksdato(dager, '2020-01-01')).toEqual(0);
    });
});

describe('useTabelldagerMap', () => {
    it('returnerer et map med utbetalingsdager', () => {
        const { result } = renderHook(() =>
            useTabelldagerMap({
                tidslinje: dager,
                gjenståendeDager: 100,
            }),
        );

        expect(result.current.get('2021-01-01')?.type).toEqual('Syk');
        expect(result.current.get('2021-01-02')?.type).toEqual('Avslått');
        expect(result.current.get('2021-01-08')?.type).toEqual('Syk');
    });

    it('mapper overstyringer', () => {
        const overstyringer: Array<Dagoverstyring> = [
            {
                hendelseId: 'en-id',
                timestamp: '2020-01-01',
                begrunnelse: 'Fordi',
                dager: [{ dato: '2021-01-02', type: Dagtype.Sykedag, grad: 80 }],
                saksbehandler: {
                    navn: 'et-navn',
                    ident: 'en-ident',
                },
                ferdigstilt: false,
            },
        ];

        const { result } = renderHook(() =>
            useTabelldagerMap({
                tidslinje: dager,
                overstyringer: overstyringer,
                gjenståendeDager: 100,
            }),
        );

        expect(result.current.get('2021-01-01')?.overstyringer).toBeUndefined();
        expect(result.current.get('2021-01-02')?.overstyringer?.[0].begrunnelse).toEqual('Fordi');
        expect(result.current.get('2021-01-02')?.overstyringer?.[0].saksbehandler.ident).toEqual('en-ident');
        expect(result.current.get('2021-01-02')?.overstyringer?.[0].saksbehandler.navn).toEqual('et-navn');
    });
});

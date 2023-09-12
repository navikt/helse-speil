import React from 'react';

import {
    Dag,
    Inntektstype,
    Periodetilstand,
    Periodetype,
    Periodevilkar,
    Sykdomsdagtype,
    Utbetalingsdagtype,
    Utbetalingstatus,
    Utbetalingtype,
} from '@io/graphql';
import { useGjenståendeDager } from '@state/arbeidsgiver';
import { render, screen } from '@testing-library/react';

import { BeregnetPopover } from './PeriodPopover';

jest.mock('@state/arbeidsgiver');

const getFetchedBeregnetPeriode = (
    arbeidsgiverUtbetalingsdager: Dag[] = [],
    personUtbetalingsdager: Dag[] = [],
): FetchedBeregnetPeriode => {
    return {
        beregningId: 'EN_ID',
        erForkastet: false,
        fom: '2022-01-01',
        tom: '2023-12-12',
        handlinger: [],
        hendelser: [],
        id: 'EN_ID',
        inntektstype: Inntektstype.Enarbeidsgiver,
        maksdato: '2023-01-01',
        notater: [],
        opprettet: '2020-01-01',
        periodehistorikk: [],
        gjenstaendeSykedager: 100,
        periodetilstand: Periodetilstand.TilGodkjenning,
        periodetype: Periodetype.Forstegangsbehandling,
        periodevilkar: {} as Periodevilkar,
        skjaeringstidspunkt: '2020-02-02',
        tidslinje: [
            {
                dato: '2022-01-01',
                kilde: {} as Kilde,
                sykdomsdagtype: Sykdomsdagtype.Arbeidsgiverdag,
                utbetalingsdagtype: Utbetalingsdagtype.Arbeidsgiverperiodedag,
            },
            ...arbeidsgiverUtbetalingsdager,
            ...personUtbetalingsdager,
        ],
        utbetaling: {
            arbeidsgiverFagsystemId: 'EN_ID',
            arbeidsgiverNettoBelop: 100,
            id: 'EN_ID',
            personFagsystemId: 'EN_ID',
            personNettoBelop: 100,
            status: Utbetalingstatus.Ubetalt,
            type: Utbetalingtype.Utbetaling,
        },
        varsler: [],
        vedtaksperiodeId: 'EN_ID',
    };
};

describe('PeriodPopover', () => {
    const arbeidsgiverUtbetalingsdager = [
        {
            dato: '2022-01-02',
            kilde: {} as Kilde,
            sykdomsdagtype: Sykdomsdagtype.Sykedag,
            utbetalingsdagtype: Utbetalingsdagtype.Navdag,
            utbetalingsinfo: {
                arbeidsgiverbelop: 100,
            },
        },
    ];
    const personUtbetalingsdager = [
        {
            dato: '2022-01-03',
            kilde: {} as Kilde,
            sykdomsdagtype: Sykdomsdagtype.Sykedag,
            utbetalingsdagtype: Utbetalingsdagtype.Navdag,
            utbetalingsinfo: {
                personbelop: 100,
            },
        },
    ];

    test('viser ingenting når det ikke er utbetaling', () => {
        render(
            <BeregnetPopover
                period={getFetchedBeregnetPeriode()}
                state="tilGodkjenning"
                fom="2023-01-01"
                tom="2023-01-01"
            />,
        );
        expect(screen.queryByText('Arbeidsgiver')).not.toBeInTheDocument();
        expect(screen.queryByText('Sykmeldt')).not.toBeInTheDocument();
    });
    test('viser arbeidsgiver når det bare er utbetaling til arbeidsgiver', () => {
        render(
            <BeregnetPopover
                period={getFetchedBeregnetPeriode(arbeidsgiverUtbetalingsdager)}
                state="tilGodkjenning"
                fom="2023-01-01"
                tom="2023-01-01"
            />,
        );
        expect(screen.getByText('Arbeidsgiver')).toBeVisible();
    });
    test('viser sykmeldt når det bare er utbetaling til sykmeldt', () => {
        render(
            <BeregnetPopover
                period={getFetchedBeregnetPeriode([], personUtbetalingsdager)}
                state="tilGodkjenning"
                fom="2023-01-01"
                tom="2023-01-01"
            />,
        );
        expect(screen.getByText('Sykmeldt')).toBeVisible();
    });
    test('viser arbeidsgiver / sykmeldt når det er utbetaling til begge', () => {
        render(
            <BeregnetPopover
                period={getFetchedBeregnetPeriode(arbeidsgiverUtbetalingsdager, personUtbetalingsdager)}
                state="tilGodkjenning"
                fom="2023-01-01"
                tom="2023-01-01"
            />,
        );
        expect(screen.getByText('Arbeidsgiver / Sykmeldt')).toBeVisible();
    });

    test('viser dager igjen', () => {
        (useGjenståendeDager as jest.Mock).mockReturnValue(100);
        render(
            <BeregnetPopover
                period={getFetchedBeregnetPeriode(arbeidsgiverUtbetalingsdager, personUtbetalingsdager)}
                state="tilGodkjenning"
                fom="2023-01-01"
                tom="2023-01-01"
            />,
        );
        expect(screen.getByText('Dager igjen:')).toBeVisible();
    });
});

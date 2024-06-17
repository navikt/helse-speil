import React from 'react';

import {
    BeregnetPeriodeFragment,
    Dag,
    Inntektstype,
    Kilde,
    Periodetilstand,
    Periodetype,
    Periodevilkar,
    Sykdomsdagtype,
    Utbetalingsdagtype,
    Utbetalingstatus,
    Utbetalingtype,
} from '@io/graphql';
import { useGjenståendeDager } from '@state/arbeidsgiver';
import { ApolloWrapper } from '@test-wrappers';
import { render, screen } from '@testing-library/react';

import { BeregnetPopover } from './PeriodPopover';

jest.mock('@state/arbeidsgiver');

const getFetchedBeregnetPeriode = (
    arbeidsgiverUtbetalingsdager: Dag[] = [],
    personUtbetalingsdager: Dag[] = [],
): BeregnetPeriodeFragment => {
    return {
        __typename: 'BeregnetPeriode',
        beregningId: 'EN_ID',
        behandlingId: 'EN_BEHANDLING_ID',
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
                __typename: 'Dag',
                dato: '2022-01-01',
                kilde: {} as Kilde,
                grad: null,
                begrunnelser: null,
                utbetalingsinfo: null,
                sykdomsdagtype: Sykdomsdagtype.Arbeidsgiverdag,
                utbetalingsdagtype: Utbetalingsdagtype.Arbeidsgiverperiodedag,
            },
            ...arbeidsgiverUtbetalingsdager,
            ...personUtbetalingsdager,
        ],
        utbetaling: {
            __typename: 'Utbetaling',
            arbeidsgiverFagsystemId: 'EN_ID',
            arbeidsgiverNettoBelop: 100,
            id: 'EN_ID',
            personFagsystemId: 'EN_ID',
            personNettoBelop: 100,
            status: Utbetalingstatus.Ubetalt,
            type: Utbetalingtype.Utbetaling,
            personsimulering: null,
            arbeidsgiversimulering: null,
            vurdering: null,
        },
        varsler: [],
        vedtaksperiodeId: 'EN_ID',
        egenskaper: [],
        avslag: [],
        vilkarsgrunnlagId: null,
        totrinnsvurdering: null,
        paVent: null,
        oppgave: null,
        forbrukteSykedager: null,
        risikovurdering: null,
    };
};

describe('PeriodPopover', () => {
    const arbeidsgiverUtbetalingsdager: Dag[] = [
        {
            __typename: 'Dag',
            dato: '2022-01-02',
            kilde: {} as Kilde,
            sykdomsdagtype: Sykdomsdagtype.Sykedag,
            utbetalingsdagtype: Utbetalingsdagtype.Navdag,
            begrunnelser: null,
            grad: null,
            utbetalingsinfo: {
                __typename: 'Utbetalingsinfo',
                arbeidsgiverbelop: 100,
                inntekt: null,
                personbelop: null,
                refusjonsbelop: null,
                totalGrad: null,
                utbetaling: null,
            },
        },
    ];
    const personUtbetalingsdager: Dag[] = [
        {
            __typename: 'Dag',
            dato: '2022-01-03',
            kilde: {} as Kilde,
            sykdomsdagtype: Sykdomsdagtype.Sykedag,
            utbetalingsdagtype: Utbetalingsdagtype.Navdag,
            grad: null,
            begrunnelser: null,
            utbetalingsinfo: {
                __typename: 'Utbetalingsinfo',
                personbelop: 100,
                arbeidsgiverbelop: null,
                inntekt: null,
                refusjonsbelop: null,
                totalGrad: null,
                utbetaling: null,
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
            { wrapper: ApolloWrapper },
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
            { wrapper: ApolloWrapper },
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
            { wrapper: ApolloWrapper },
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
            { wrapper: ApolloWrapper },
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
            { wrapper: ApolloWrapper },
        );
        expect(screen.getByText('Dager igjen:')).toBeVisible();
    });
});

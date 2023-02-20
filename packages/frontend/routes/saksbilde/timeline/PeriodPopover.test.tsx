import React from 'react';

import {
    Inntektstype,
    Periodetilstand,
    Periodetype,
    Periodevilkar,
    Sykdomsdagtype,
    Utbetalingsdagtype,
    Utbetalingstatus,
    Utbetalingtype,
} from '@io/graphql';
import { render, screen } from '@testing-library/react';

import { BeregnetPopover, PeriodPopover } from './PeriodPopover';

const getFetchedBeregnetPeriode = (
    arbeidsgiverNettobelop: number,
    personNettobelop: number
): FetchedBeregnetPeriode => {
    return {
        aktivitetslogg: [],
        beregningId: 'EN_ID',
        erForkastet: false,
        fom: '2022-01-01',
        tom: '2023-12-12',
        hendelser: [],
        id: 'EN_ID',
        inntektFraAordningen: [],
        inntektstype: Inntektstype.Enarbeidsgiver,
        maksdato: '2023-01-01',
        notater: [],
        opprettet: '2020-01-01',
        periodehistorikk: [],
        periodetilstand: Periodetilstand.TilGodkjenning,
        periodetype: Periodetype.Forstegangsbehandling,
        periodevilkar: {} as Periodevilkar,
        skjaeringstidspunkt: 'ET_SKJAERINGSTIDSPUNKT',
        tidslinje: [
            {
                dato: '2022-01-01',
                kilde: {} as Kilde,
                sykdomsdagtype: Sykdomsdagtype.Arbeidsgiverdag,
                utbetalingsdagtype: Utbetalingsdagtype.Arbeidsgiverperiodedag,
            },
        ],
        utbetaling: {
            arbeidsgiverFagsystemId: 'EN_ID',
            arbeidsgiverNettoBelop: arbeidsgiverNettobelop,
            id: 'EN_ID',
            personFagsystemId: 'EN_ID',
            personNettoBelop: personNettobelop,
            status: Utbetalingstatus.Ubetalt,
            type: Utbetalingtype.Utbetaling,
        },
        varsler: [],
        varslerForGenerasjon: [],
        vedtaksperiodeId: 'EN_ID',
    };
};

describe('PeriodPopover', () => {
    test('viser ingenting når det ikke er utbetaling', () => {
        render(
            <BeregnetPopover
                period={getFetchedBeregnetPeriode(0, 0)}
                state="tilGodkjenning"
                fom="2023-01-01"
                tom="2023-01-01"
            />
        );
        expect(screen.queryByText('Arbeidsgiver')).not.toBeInTheDocument();
        expect(screen.queryByText('Sykmeldt')).not.toBeInTheDocument();
    });
    test('viser arbeidsgiver når det bare er utbetaling til arbeidsgiver', () => {
        render(
            <BeregnetPopover
                period={getFetchedBeregnetPeriode(1, 0)}
                state="tilGodkjenning"
                fom="2023-01-01"
                tom="2023-01-01"
            />
        );
        expect(screen.getByText('Arbeidsgiver')).toBeVisible();
    });
    test('viser sykmeldt når det bare er utbetaling til sykmeldt', () => {
        render(
            <BeregnetPopover
                period={getFetchedBeregnetPeriode(0, 1)}
                state="tilGodkjenning"
                fom="2023-01-01"
                tom="2023-01-01"
            />
        );
        expect(screen.getByText('Sykmeldt')).toBeVisible();
    });
    test('viser arbeidsgiver / sykmeldt når det er utbetaling til begge', () => {
        render(
            <BeregnetPopover
                period={getFetchedBeregnetPeriode(1, 1)}
                state="tilGodkjenning"
                fom="2023-01-01"
                tom="2023-01-01"
            />
        );
        expect(screen.getByText('Arbeidsgiver / Sykmeldt')).toBeVisible();
    });
});

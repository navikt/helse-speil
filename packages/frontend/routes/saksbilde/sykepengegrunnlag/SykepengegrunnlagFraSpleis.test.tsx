import { RecoilWrapper } from '@test-wrappers';
import React from 'react';

import {
    useArbeidsgiver,
    useEndringerForPeriode,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enArbeidsgiverinntekt } from '@test-data/arbeidsgiverinntekt';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';
import { render, screen } from '@testing-library/react';

import { useVilkårsgrunnlag } from './Sykepengegrunnlag';
import { SykepengegrunnlagFraSpleis } from './SykepengegrunnlagFraSpleis';

jest.mock('@state/arbeidsgiver');
jest.mock('@state/periode');

describe('SykepengegrunnlagFraSpleis', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it.skip('rendrer inntektsgrunnlag og inntektskilder', () => {
        const arbeidsgiver = enArbeidsgiver();
        const { organisasjonsnummer } = arbeidsgiver;
        const skjaeringstidspunkt = '2020-01-01';
        const inntektFraAO = enArbeidsgiverinntekt({ arbeidsgiver: organisasjonsnummer }).medInntektFraAOrdningen();
        const inntektFraIM = enArbeidsgiverinntekt({ arbeidsgiver: organisasjonsnummer }).medInntektFraAOrdningen();
        const inntekter = [inntektFraIM, inntektFraAO];
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({ skjaeringstidspunkt }).medInntekter(inntekter);

        (useActivePeriod as jest.Mock).mockReturnValue(enBeregnetPeriode());
        (usePeriodForSkjæringstidspunktForArbeidsgiver as jest.Mock).mockReturnValue(enBeregnetPeriode());
        (useArbeidsgiver as jest.Mock).mockReturnValue(arbeidsgiver);
        (useEndringerForPeriode as jest.Mock).mockReturnValue([]);
        (useVilkårsgrunnlag as jest.Mock).mockReturnValue(vilkårsgrunnlag);

        render(
            <SykepengegrunnlagFraSpleis
                vilkårsgrunnlag={vilkårsgrunnlag}
                skjæringstidspunkt={skjaeringstidspunkt}
                organisasjonsnummer={organisasjonsnummer}
            />
        );

        expect(screen.getByText('Inntektsgrunnlag')).toBeVisible();
        expect(screen.getByText('Sammenligningsgrunnlag')).toBeVisible();
        expect(screen.getByText('Beregnet månedsinntekt')).toBeVisible();
        expect(screen.getByText('Omregnet til månedsinntekt')).toBeVisible();
        expect(screen.getByText('RAPPORTERT SISTE 3 MÅNEDER')).toBeVisible();
        expect(screen.getAllByText(arbeidsgiver.navn)).toHaveLength(2);
    });

    it('rendrer beregnet månedsinntekt for ghostperioder', () => {
        const arbeidsgiver = enArbeidsgiver();
        const { organisasjonsnummer } = arbeidsgiver;
        const skjaeringstidspunkt = '2020-01-01';
        const inntektFraAO = enArbeidsgiverinntekt({ arbeidsgiver: organisasjonsnummer }).medInntektFraAOrdningen();
        const inntektFraIM = enArbeidsgiverinntekt({ arbeidsgiver: organisasjonsnummer }).medInntektFraAOrdningen();
        const inntekter = [inntektFraIM, inntektFraAO];
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({ skjaeringstidspunkt }).medInntekter(inntekter);

        (useActivePeriod as jest.Mock).mockReturnValue(enGhostPeriode());
        (usePeriodForSkjæringstidspunktForArbeidsgiver as jest.Mock).mockReturnValue(enGhostPeriode());
        (useArbeidsgiver as jest.Mock).mockReturnValue(arbeidsgiver);
        (useEndringerForPeriode as jest.Mock).mockReturnValue([]);

        render(
            <SykepengegrunnlagFraSpleis
                vilkårsgrunnlag={vilkårsgrunnlag}
                skjæringstidspunkt={skjaeringstidspunkt}
                organisasjonsnummer={organisasjonsnummer}
            />,
            { wrapper: RecoilWrapper }
        );

        expect(screen.getByText('Inntektsgrunnlag')).toBeVisible();
        expect(screen.getByText('Sammenligningsgrunnlag')).toBeVisible();
        expect(screen.getByText('Beregnet månedsinntekt')).toBeVisible();
        expect(screen.getByText('RAPPORTERT SISTE 3 MÅNEDER')).toBeVisible();
        expect(screen.getByText('Omregnet rapportert årsinntekt')).toBeVisible();
        expect(screen.getAllByText(arbeidsgiver.navn)).toHaveLength(3);
    });
});

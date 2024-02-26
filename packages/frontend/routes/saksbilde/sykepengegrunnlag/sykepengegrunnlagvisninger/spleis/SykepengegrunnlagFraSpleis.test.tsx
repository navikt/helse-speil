import { RecoilWrapper } from '@test-wrappers';
import fetchMock from 'jest-fetch-mock';
import React from 'react';
import { RecoilRoot } from 'recoil';

import { useIsAnonymous } from '@state/anonymization';
import {
    useArbeidsgiver,
    useEndringerForPeriode,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enArbeidsgiverinntekt } from '@test-data/arbeidsgiverinntekt';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';
import { render, screen } from '@testing-library/react';

import { useVilkårsgrunnlag } from '../../useVilkårsgrunnlag';
import { SykepengegrunnlagFraSpleis } from './SykepengegrunnlagFraSpleis';

jest.mock('@state/arbeidsgiver');
jest.mock('@state/periode');
jest.mock('../../useVilkårsgrunnlag');
jest.mock('@state/toggles');
jest.mock('@state/anonymization');
// jest.mock('../../skjønnsfastsetting');

jest.mock('@utils/featureToggles', () => ({
    erUtvikling: () => true,
    erProd: () => false,
}));

describe('SykepengegrunnlagFraSpleis', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        fetchMock.doMock();
    });

    it('rendrer inntektsgrunnlag og inntektskilder', () => {
        // TODO: Få med inntekt fra IM/spleis for å få riktig data for test av periode med sykefravær
        const arbeidsgiver = enArbeidsgiver();
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);
        const { organisasjonsnummer } = arbeidsgiver;
        const skjaeringstidspunkt = '2020-01-01';
        const inntektFraIM = enArbeidsgiverinntekt({ arbeidsgiver: organisasjonsnummer }).medInntektFraAOrdningen();
        const inntekter = [inntektFraIM];
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({ skjaeringstidspunkt }).medInntekter(inntekter);

        (useActivePeriod as jest.Mock).mockReturnValue(enBeregnetPeriode());
        (usePeriodForSkjæringstidspunktForArbeidsgiver as jest.Mock).mockReturnValue(enBeregnetPeriode());
        (useArbeidsgiver as jest.Mock).mockReturnValue(arbeidsgiver);
        (useEndringerForPeriode as jest.Mock).mockReturnValue({
            inntektsendringer: [],
            arbeidsforholdendringer: [],
            dagendringer: [],
        });
        (useCurrentPerson as jest.Mock).mockReturnValue(person);
        (useVilkårsgrunnlag as jest.Mock).mockReturnValue(vilkårsgrunnlag);
        (useIsAnonymous as jest.Mock).mockReturnValue(false);

        render(
            <RecoilRoot>
                <SykepengegrunnlagFraSpleis
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    organisasjonsnummer={organisasjonsnummer}
                />
                ,
            </RecoilRoot>,
        );

        expect(screen.getByText('Inntektsgrunnlag')).toBeVisible();
        expect(screen.getByText('Sammenligningsgrunnlag')).toBeVisible();
        expect(screen.getByText('Beregnet månedsinntekt')).toBeVisible();
        //expect(screen.getByText('Omregnet til årsinntekt')).toBeVisible();
        //expect(screen.getByText('RAPPORTERT SISTE 3 MÅNEDER')).toBeVisible();
        expect(screen.getAllByText(arbeidsgiver.navn)).toHaveLength(2);
    });

    it('rendrer beregnet månedsinntekt for ghostperioder', () => {
        const arbeidsgiver = enArbeidsgiver();
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);
        const { organisasjonsnummer } = arbeidsgiver;
        const skjaeringstidspunkt = '2020-01-01';
        const inntektFraAO = enArbeidsgiverinntekt({ arbeidsgiver: '900800700' });
        const inntektFraIM = enArbeidsgiverinntekt({ arbeidsgiver: organisasjonsnummer }).medInntektFraAOrdningen();
        const inntekter = [inntektFraIM, inntektFraAO];
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({ skjaeringstidspunkt }).medInntekter(inntekter);

        (useActivePeriod as jest.Mock).mockReturnValue(enGhostPeriode());
        (usePeriodForSkjæringstidspunktForArbeidsgiver as jest.Mock).mockReturnValue(enGhostPeriode());
        (useArbeidsgiver as jest.Mock).mockReturnValue(arbeidsgiver);
        (useEndringerForPeriode as jest.Mock).mockReturnValue({
            inntektsendringer: [],
            arbeidsforholdendringer: [],
            dagendringer: [],
        });
        (useCurrentPerson as jest.Mock).mockReturnValue(person);

        render(
            <SykepengegrunnlagFraSpleis vilkårsgrunnlag={vilkårsgrunnlag} organisasjonsnummer={organisasjonsnummer} />,
            { wrapper: RecoilWrapper },
        );

        expect(screen.getByText('Inntektsgrunnlag')).toBeVisible();
        expect(screen.getByText('Sammenligningsgrunnlag')).toBeVisible();
        expect(screen.getByText('Beregnet månedsinntekt')).toBeVisible();
        expect(screen.getByText('RAPPORTERT SISTE 3 MÅNEDER')).toBeVisible();
        expect(screen.getByText('Omregnet rapportert årsinntekt')).toBeVisible();
        expect(screen.getAllByText(arbeidsgiver.navn)).toHaveLength(3);
    });
});

export function mockFetch(data: string) {
    return jest.fn().mockImplementation(() =>
        Promise.resolve({
            ok: true,
            json: () => data,
        }),
    );
}

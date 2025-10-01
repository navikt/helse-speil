import fetchMock from 'jest-fetch-mock';
import { createStore } from 'jotai/index';
import React from 'react';

import { PersonStoreContext } from '@/state/contexts/personStore';
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import { useIsAnonymous } from '@state/anonymization';
import {
    finnArbeidsgiver,
    useEndringerForPeriode,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enArbeidsgiverinntekt } from '@test-data/arbeidsgiverinntekt';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { tilleggsinfoFraEnInntektskilde } from '@test-data/tilleggsinfoFraInntektskilde';
import { etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';
import { render, screen } from '@test-utils';

import { SykepengegrunnlagFraSpleis } from './SykepengegrunnlagFraSpleis';

jest.mock('@state/arbeidsgiver');
jest.mock('@state/periode');
jest.mock('@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag');
jest.mock('@state/toggles');
jest.mock('@state/anonymization');
jest.mock('@state/person');

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
        const { organisasjonsnummer } = arbeidsgiver;
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);
        const skjaeringstidspunkt = '2020-01-01';
        const inntektFraIM = enArbeidsgiverinntekt({ arbeidsgiver: organisasjonsnummer }).medInntektFraAOrdningen();
        const inntekter = [inntektFraIM];
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({ skjaeringstidspunkt }).medInntekter(inntekter);

        (useFetchPersonQuery as jest.Mock).mockReturnValue({ data: { person: person } });
        (useActivePeriod as jest.Mock).mockReturnValue(enBeregnetPeriode());
        (usePeriodForSkjæringstidspunktForArbeidsgiver as jest.Mock).mockReturnValue(enBeregnetPeriode());
        (finnArbeidsgiver as jest.Mock).mockReturnValue(arbeidsgiver);
        (useEndringerForPeriode as jest.Mock).mockReturnValue({
            inntektsendringer: [],
            arbeidsforholdendringer: [],
            dagendringer: [],
            skjønnsfastsettingsendringer: [],
        });
        (useVilkårsgrunnlag as jest.Mock).mockReturnValue(vilkårsgrunnlag);
        (useIsAnonymous as jest.Mock).mockReturnValue(false);

        renderWithProvider(
            <SykepengegrunnlagFraSpleis
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={organisasjonsnummer}
                person={person}
                periode={enBeregnetPeriode()}
            />,
        );

        expect(screen.getByText('Inntektsgrunnlag')).toBeVisible();
        expect(screen.getByText('Sammenligningsgr.')).toBeVisible();
        expect(screen.getByText('Beregnet månedsinntekt')).toBeVisible();
        //expect(screen.getByText('Omregnet til årsinntekt')).toBeVisible();
        //expect(screen.getByText('RAPPORTERT SISTE 3 MÅNEDER')).toBeVisible();
        expect(screen.getAllByText(arbeidsgiver.navn)).toHaveLength(2);
    });

    it('render navn på arbeidsgiver uten inntektsgrunnlag under sykepengegrunnlag-fanen', () => {
        const arbeidsgiver = enArbeidsgiver();
        const { organisasjonsnummer } = arbeidsgiver;
        const annenInntekskildeNavn = 'Pengeløs Sparebank';
        const tilleggsinfoForInntektskilder = [
            tilleggsinfoFraEnInntektskilde({ orgnummer: organisasjonsnummer }),
            tilleggsinfoFraEnInntektskilde({ navn: annenInntekskildeNavn, orgnummer: '999999999' }),
        ];
        const person = enPerson()
            .medArbeidsgivere([arbeidsgiver])
            .medTilleggsinfoForInntektskilder(tilleggsinfoForInntektskilder);
        const skjaeringstidspunkt = '2020-01-01';
        const inntekter = [
            enArbeidsgiverinntekt({ arbeidsgiver: organisasjonsnummer }).medInntektFraAOrdningen(),
            enArbeidsgiverinntekt({
                arbeidsgiver: '999999999',
                omregnetArsinntekt: null,
                sammenligningsgrunnlag: null,
            }),
        ];
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({ skjaeringstidspunkt }).medInntekter(inntekter);

        (useEndringerForPeriode as jest.Mock).mockReturnValue({
            inntektsendringer: [],
            arbeidsforholdendringer: [],
            dagendringer: [],
            skjønnsfastsettingsendringer: [],
        });

        renderWithProvider(
            <SykepengegrunnlagFraSpleis
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={organisasjonsnummer}
                person={person}
                periode={enBeregnetPeriode()}
            />,
        );
        expect(screen.getByText(annenInntekskildeNavn)).toBeVisible();
    });

    it('rendrer beregnet månedsinntekt for ghostperioder', () => {
        const arbeidsgiver = enArbeidsgiver();
        const { organisasjonsnummer } = arbeidsgiver;
        const tilleggsinfoForInntektskilder = [
            tilleggsinfoFraEnInntektskilde({ orgnummer: organisasjonsnummer }),
            tilleggsinfoFraEnInntektskilde({ orgnummer: '900800700' }),
        ];
        const person = enPerson()
            .medArbeidsgivere([arbeidsgiver])
            .medTilleggsinfoForInntektskilder(tilleggsinfoForInntektskilder);
        const skjaeringstidspunkt = '2020-01-01';
        const inntektFraAO = enArbeidsgiverinntekt({ arbeidsgiver: '900800700' });
        const inntektFraIM = enArbeidsgiverinntekt({ arbeidsgiver: organisasjonsnummer }).medInntektFraAOrdningen();
        const inntekter = [inntektFraIM, inntektFraAO];
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({ skjaeringstidspunkt }).medInntekter(inntekter);

        (useActivePeriod as jest.Mock).mockReturnValue(enGhostPeriode());
        (usePeriodForSkjæringstidspunktForArbeidsgiver as jest.Mock).mockReturnValue(enGhostPeriode());
        (finnArbeidsgiver as jest.Mock).mockReturnValue(arbeidsgiver);
        (useEndringerForPeriode as jest.Mock).mockReturnValue({
            inntektsendringer: [],
            arbeidsforholdendringer: [],
            dagendringer: [],
            skjønnsfastsettingsendringer: [],
        });

        renderWithProvider(
            <SykepengegrunnlagFraSpleis
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={organisasjonsnummer}
                person={person}
                periode={enBeregnetPeriode()}
            />,
        );

        expect(screen.getByText('Inntektsgrunnlag')).toBeVisible();
        expect(screen.getByText('Sammenligningsgr.')).toBeVisible();
        expect(screen.getByText('Beregnet månedsinntekt')).toBeVisible();
        expect(screen.getByText('RAPPORTERT SISTE 3 MÅNEDER')).toBeVisible();
        expect(screen.getAllByText(arbeidsgiver.navn)).toHaveLength(3);
    });
});

export const renderWithProvider = (ui: React.ReactNode) =>
    render(<PersonStoreContext.Provider value={createStore()}>{ui}</PersonStoreContext.Provider>);

import { createStore } from 'jotai';
import React from 'react';
import { Mock, vi } from 'vitest';

import { useSkjønnsfastsettelsesMaler } from '@external/sanity';
import { useEndringerForPeriode } from '@hooks/useEndringerForPeriode';
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import { PersonStoreContext } from '@state/contexts/personStore';
import { useActivePeriod, useActivePeriodWithPerson } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enArbeidsgiverinntekt } from '@test-data/arbeidsgiverinntekt';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { tilleggsinfoFraEnInntektskilde } from '@test-data/tilleggsinfoFraInntektskilde';
import { etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';
import { render, screen } from '@test-utils';

import { SykepengegrunnlagFraSpleis } from './SykepengegrunnlagFraSpleis';

vi.mock('@external/sanity');
vi.mock('@state/periode');
vi.mock('@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag');
vi.mock('@state/toggles');
vi.mock('@state/person');
vi.mock('@hooks/useEndringerForPeriode');

describe('SykepengegrunnlagFraSpleis', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    beforeEach(() => {
        (useSkjønnsfastsettelsesMaler as Mock).mockReturnValue({
            maler: [],
            loading: false,
        });
    });

    it('rendrer inntektsgrunnlag og inntektskilder', () => {
        // TODO: Få med inntekt fra IM/spleis for å få riktig data for test av periode med sykefravær
        const arbeidsgiver = enArbeidsgiver();
        const { organisasjonsnummer } = arbeidsgiver;
        const tilleggsinfoForInntektskilder = [
            tilleggsinfoFraEnInntektskilde({ navn: arbeidsgiver.navn, orgnummer: arbeidsgiver.organisasjonsnummer }),
        ];
        const person = enPerson()
            .medArbeidsgivere([arbeidsgiver])
            .medTilleggsinfoForInntektskilder(tilleggsinfoForInntektskilder);
        const skjaeringstidspunkt = '2020-01-01';
        const inntektFraIM = enArbeidsgiverinntekt({ arbeidsgiver: organisasjonsnummer }).medInntektFraAOrdningen();
        const inntekter = [inntektFraIM];
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({ skjaeringstidspunkt }).medInntekter(inntekter);

        (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: person } });
        (useActivePeriod as Mock).mockReturnValue(enBeregnetPeriode());
        (useEndringerForPeriode as Mock).mockReturnValue({
            inntektsendringer: [],
            arbeidsforholdendringer: [],
            dagendringer: [],
            skjønnsfastsettingsendringer: [],
        });
        (useVilkårsgrunnlag as Mock).mockReturnValue(vilkårsgrunnlag);

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

        (useEndringerForPeriode as Mock).mockReturnValue({
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

        (useActivePeriod as Mock).mockReturnValue(enGhostPeriode());
        (useEndringerForPeriode as Mock).mockReturnValue({
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

    it('rendrer inntekt for arbeidsgiver som mangler både periode og ghost-periode', () => {
        const arbeidsgiverMedSykdom = enArbeidsgiver();
        const arbeidsgiverUtenPølse = enArbeidsgiver({
            navn: 'Uten Pølse AS',
            organisasjonsnummer: '900800700',
            behandlinger: [],
            ghostPerioder: [],
        });
        const person = enPerson()
            .medArbeidsgivere([arbeidsgiverMedSykdom, arbeidsgiverUtenPølse])
            .medTilleggsinfoForInntektskilder([
                tilleggsinfoFraEnInntektskilde({
                    navn: arbeidsgiverMedSykdom.navn,
                    orgnummer: arbeidsgiverMedSykdom.organisasjonsnummer,
                }),
                tilleggsinfoFraEnInntektskilde({
                    navn: arbeidsgiverUtenPølse.navn,
                    orgnummer: arbeidsgiverUtenPølse.organisasjonsnummer,
                }),
            ]);
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({ skjaeringstidspunkt: '2020-01-01' }).medInntekter([
            enArbeidsgiverinntekt({ arbeidsgiver: arbeidsgiverMedSykdom.organisasjonsnummer }),
            enArbeidsgiverinntekt({ arbeidsgiver: arbeidsgiverUtenPølse.organisasjonsnummer }),
        ]);

        (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: person } });
        (useActivePeriod as Mock).mockReturnValue(enBeregnetPeriode());
        (useEndringerForPeriode as Mock).mockReturnValue({
            inntektsendringer: [],
            arbeidsforholdendringer: [],
            dagendringer: [],
            skjønnsfastsettingsendringer: [],
        });
        (useVilkårsgrunnlag as Mock).mockReturnValue(vilkårsgrunnlag);

        renderWithProvider(
            <SykepengegrunnlagFraSpleis
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={arbeidsgiverUtenPølse.organisasjonsnummer}
                person={person}
                periode={enBeregnetPeriode()}
            />,
        );

        expect(screen.getByText('Beregnet månedsinntekt')).toBeVisible();
        expect(screen.getAllByText(arbeidsgiverUtenPølse.navn).length).toBeGreaterThan(1);
    });

    it('forklarer hvorfor et aktivt arbeidsforhold uten pølse er med i beregningsgrunnlaget', () => {
        const { vilkårsgrunnlag, person, arbeidsgiverUtenPølse } = etGrunnlagMedArbeidsforholdUtenPølse({
            deaktivert: false,
        });

        renderWithProvider(
            <SykepengegrunnlagFraSpleis
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={arbeidsgiverUtenPølse.organisasjonsnummer}
                person={person}
                periode={enBeregnetPeriode()}
            />,
        );

        expect(screen.getByText(/tatt med i beregningsgrunnlaget/)).toBeVisible();
    });

    it('forklarer ikke beregningsgrunnlaget for et deaktivert arbeidsforhold uten pølse', () => {
        const { vilkårsgrunnlag, person, arbeidsgiverUtenPølse } = etGrunnlagMedArbeidsforholdUtenPølse({
            deaktivert: true,
        });

        renderWithProvider(
            <SykepengegrunnlagFraSpleis
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={arbeidsgiverUtenPølse.organisasjonsnummer}
                person={person}
                periode={enBeregnetPeriode()}
            />,
        );

        expect(screen.getByText('Brukes ikke i beregningen')).toBeVisible();
        expect(screen.queryByText(/tatt med i beregningsgrunnlaget/)).not.toBeInTheDocument();
    });
});

/**
 * Bygger et vilkårsgrunnlag der én arbeidsgiver har sykdom og én er et arbeidsforhold uten pølse,
 * altså uten både periode og ghost-periode på skjæringstidspunktet.
 */
function etGrunnlagMedArbeidsforholdUtenPølse({ deaktivert }: { deaktivert: boolean }) {
    const arbeidsgiverMedSykdom = enArbeidsgiver();
    const arbeidsgiverUtenPølse = enArbeidsgiver({
        navn: 'Uten Pølse AS',
        organisasjonsnummer: '900800700',
        behandlinger: [],
        ghostPerioder: [],
    });
    const person = enPerson()
        .medArbeidsgivere([arbeidsgiverMedSykdom, arbeidsgiverUtenPølse])
        .medTilleggsinfoForInntektskilder([
            tilleggsinfoFraEnInntektskilde({
                navn: arbeidsgiverMedSykdom.navn,
                orgnummer: arbeidsgiverMedSykdom.organisasjonsnummer,
            }),
            tilleggsinfoFraEnInntektskilde({
                navn: arbeidsgiverUtenPølse.navn,
                orgnummer: arbeidsgiverUtenPølse.organisasjonsnummer,
            }),
        ]);
    const inntektUtenPølse = enArbeidsgiverinntekt({
        arbeidsgiver: arbeidsgiverUtenPølse.organisasjonsnummer,
        deaktivert,
    }).medInntektFraAOrdningen();
    const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({ skjaeringstidspunkt: '2020-01-01' }).medInntekter([
        enArbeidsgiverinntekt({ arbeidsgiver: arbeidsgiverMedSykdom.organisasjonsnummer }),
        inntektUtenPølse,
    ]);
    const aktivPeriode = arbeidsgiverMedSykdom.behandlinger[0]!.perioder[0]!;

    (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: person } });
    (useActivePeriod as Mock).mockReturnValue(aktivPeriode);
    (useActivePeriodWithPerson as Mock).mockReturnValue(aktivPeriode);
    (useEndringerForPeriode as Mock).mockReturnValue({
        inntektsendringer: [],
        arbeidsforholdendringer: [],
        dagendringer: [],
        skjønnsfastsettingsendringer: [],
    });
    (useVilkårsgrunnlag as Mock).mockReturnValue(vilkårsgrunnlag);

    return { vilkårsgrunnlag, person, arbeidsgiverUtenPølse };
}

export const renderWithProvider = (ui: React.ReactNode) =>
    render(<PersonStoreContext.Provider value={createStore()}>{ui}</PersonStoreContext.Provider>);

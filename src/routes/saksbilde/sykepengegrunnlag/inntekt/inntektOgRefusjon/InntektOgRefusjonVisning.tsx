import React from 'react';

import { useEndringerForPeriode } from '@hooks/useEndringerForPeriode';
import {
    BeregnetPeriodeFragment,
    InntektFraAOrdningen,
    Inntektskilde,
    OmregnetArsinntekt,
    Overstyring,
    PersonFragment,
    VilkarsgrunnlagSpleisV2,
} from '@io/graphql';
import { useLokaleRefusjonsopplysninger, useLokaltMånedsbeløp } from '@state/inntektsforhold/arbeidsgiver';
import { getVilkårsgrunnlag } from '@state/utils';
import { Refusjonsopplysning } from '@typer/overstyring';
import { ActivePeriod } from '@typer/shared';
import { isGhostPeriode } from '@utils/typeguards';

import { OverstyrArbeidsforholdUtenSykdom } from '../../overstyring/OverstyrArbeidsforholdUtenSykdom';
import { Refusjonsoversikt } from '../../refusjon/Refusjonsoversikt';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { SisteTolvMånedersInntekt } from './SisteTolvMånedersInntekt';
import { useArbeidsforholdKanOverstyres } from './inntektOgRefusjonUtils';

interface InntektOgRefusjonVisningProps {
    person: PersonFragment;
    periode: ActivePeriod;
    omregnetÅrsinntekt: OmregnetArsinntekt | null;
    endret: boolean;
    refusjon?: Refusjonsopplysning[] | null;
    vilkårsgrunnlagId?: string | null;
    inntektFraAOrdningen?: InntektFraAOrdningen[];
    erDeaktivert: boolean;
    inntekterForSammenligningsgrunnlag?: Array<InntektFraAOrdningen>;
    harSykefravær: boolean;
    organisasjonsnummer: string;
    overstyringer: Overstyring[];
}

export const InntektOgRefusjonVisning = ({
    person,
    periode,
    omregnetÅrsinntekt,
    endret,
    refusjon,
    vilkårsgrunnlagId,
    inntektFraAOrdningen,
    erDeaktivert,
    inntekterForSammenligningsgrunnlag,
    harSykefravær,
    organisasjonsnummer,
    overstyringer,
}: InntektOgRefusjonVisningProps) => {
    const { skjaeringstidspunkt: skjæringstidspunkt } = periode as BeregnetPeriodeFragment;

    const arbeidsforholdKanOverstyres = useArbeidsforholdKanOverstyres(person, skjæringstidspunkt, organisasjonsnummer);
    const { inntektsendringer } = useEndringerForPeriode(overstyringer, person);
    const lokaleRefusjonsopplysninger = useLokaleRefusjonsopplysninger(organisasjonsnummer, skjæringstidspunkt);
    const lokaltMånedsbeløp = useLokaltMånedsbeløp(organisasjonsnummer, skjæringstidspunkt);
    const erGhostperiode = isGhostPeriode(periode);
    const erInntektskildeAordningen = omregnetÅrsinntekt?.kilde === Inntektskilde.Aordningen;
    const skalVise12mnd828 =
        Number(
            (getVilkårsgrunnlag(person, vilkårsgrunnlagId) as VilkarsgrunnlagSpleisV2)?.avviksvurdering
                ?.avviksprosent ?? 0,
        ) > 25;

    function finnInntektFraAOrdningen(): InntektFraAOrdningen[] | undefined {
        if (
            erInntektskildeAordningen &&
            !skalVise12mnd828 &&
            omregnetÅrsinntekt?.inntektFraAOrdningen &&
            omregnetÅrsinntekt.inntektFraAOrdningen.length > 0
        ) {
            return omregnetÅrsinntekt.inntektFraAOrdningen;
        } else {
            return inntektFraAOrdningen;
        }
    }

    return (
        <>
            <ReadOnlyInntekt
                omregnetÅrsinntekt={omregnetÅrsinntekt}
                lokaltMånedsbeløp={lokaltMånedsbeløp}
                endret={endret}
                inntektsendringer={inntektsendringer}
            />
            {refusjon && refusjon.length !== 0 && (
                <Refusjonsoversikt refusjon={refusjon} lokaleRefusjonsopplysninger={lokaleRefusjonsopplysninger} />
            )}
            <SisteTolvMånedersInntekt
                skjæringstidspunkt={skjæringstidspunkt}
                inntektFraAOrdningen={finnInntektFraAOrdningen()}
                erAktivGhost={erGhostperiode && !erDeaktivert}
                inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
            />
            {arbeidsforholdKanOverstyres && !harSykefravær && (
                <OverstyrArbeidsforholdUtenSykdom
                    organisasjonsnummerAktivPeriode={organisasjonsnummer}
                    skjæringstidspunkt={skjæringstidspunkt}
                    arbeidsforholdErDeaktivert={erDeaktivert}
                    person={person}
                />
            )}
        </>
    );
};

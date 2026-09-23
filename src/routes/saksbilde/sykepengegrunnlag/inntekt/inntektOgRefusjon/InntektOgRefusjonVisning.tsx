import React from 'react';

import { useEndringerForPeriode } from '@hooks/useEndringerForPeriode';
import {
    Arbeidsgiver,
    InntektFraAOrdningen,
    Inntektskilde,
    OmregnetArsinntekt,
    PersonFragment,
    VilkarsgrunnlagSpleisV2,
} from '@io/graphql';
import { OmregnetÅrsinntekt } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/OmregetÅrsinntekt';
import { OverstyrArbeidsforholdUtenSykdom } from '@saksbilde/sykepengegrunnlag/overstyring/OverstyrArbeidsforholdUtenSykdom';
import { Refusjonsoversikt } from '@saksbilde/sykepengegrunnlag/refusjon/Refusjonsoversikt';
import {
    harSykefraværMedSkjæringstidspunkt,
    useLokaleRefusjonsopplysninger,
    useLokaltMånedsbeløp,
} from '@state/inntektsforhold/arbeidsgiver';
import { getVilkårsgrunnlag } from '@state/utils';
import { Refusjonsopplysning } from '@typer/overstyring';
import { DateString } from '@typer/shared';

import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { SisteTolvMånedersInntekt } from './SisteTolvMånedersInntekt';
import { useArbeidsforholdKanOverstyres } from './inntektOgRefusjonUtils';

interface InntektOgRefusjonVisningProps {
    person: PersonFragment;
    skjæringstidspunkt: DateString;
    omregnetÅrsinntekt: OmregnetArsinntekt | null;
    endret: boolean;
    refusjon?: Refusjonsopplysning[] | null;
    vilkårsgrunnlagId?: string | null;
    inntektFraAOrdningen?: InntektFraAOrdningen[];
    erDeaktivert: boolean;
    inntekterForSammenligningsgrunnlag?: InntektFraAOrdningen[];
    arbeidsgiver: Arbeidsgiver;
}

export const InntektOgRefusjonVisning = ({
    person,
    skjæringstidspunkt,
    omregnetÅrsinntekt,
    endret,
    refusjon,
    vilkårsgrunnlagId,
    inntektFraAOrdningen,
    erDeaktivert,
    inntekterForSammenligningsgrunnlag,
    arbeidsgiver,
}: InntektOgRefusjonVisningProps) => {
    const organisasjonsnummer = arbeidsgiver.organisasjonsnummer;

    const arbeidsforholdKanOverstyres = useArbeidsforholdKanOverstyres(person, skjæringstidspunkt, organisasjonsnummer);
    const { inntektsendringer } = useEndringerForPeriode(arbeidsgiver.overstyringer, person);
    const lokaleRefusjonsopplysninger = useLokaleRefusjonsopplysninger(organisasjonsnummer, skjæringstidspunkt);
    const lokaltMånedsbeløp = useLokaltMånedsbeløp(organisasjonsnummer, skjæringstidspunkt);
    const utenSykefravær = !harSykefraværMedSkjæringstidspunkt(arbeidsgiver, skjæringstidspunkt);
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
            <OmregnetÅrsinntekt
                omregnetÅrsintekt={omregnetÅrsinntekt?.belop}
                gap="space-96"
                harLokaltMånedsbeløp={lokaltMånedsbeløp != null}
            />
            {refusjon && refusjon.length !== 0 && (
                <Refusjonsoversikt refusjon={refusjon} lokaleRefusjonsopplysninger={lokaleRefusjonsopplysninger} />
            )}
            <SisteTolvMånedersInntekt
                skjæringstidspunkt={skjæringstidspunkt}
                inntektFraAOrdningen={finnInntektFraAOrdningen()}
                erAktivGhost={utenSykefravær && !erDeaktivert}
                inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
            />
            {(arbeidsforholdKanOverstyres || erDeaktivert) && (
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

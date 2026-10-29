import React, { useState } from 'react';

import { HStack, Label, Tag } from '@navikt/ds-react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import {
    ApiArbeidsgiver,
    ApiArbeidsgiverinntekt,
    ApiInntektFraAOrdningen,
    ApiInntektstype,
    ApiSaksbildePerson,
} from '@io/rest/generated/spesialist.schemas';
import { InntektOgRefusjonHeader } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/InntektOgRefusjonHeader';
import { InntektOgRefusjonVisning } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/InntektOgRefusjonVisning';
import { ToggleOverstyring } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/ToggleOverstyring';
import { InntektOgRefusjonSkjema } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/InntektOgRefusjonSkjema';
import { useInntekterFraAordningen } from '@state/inntekterFraAordningen';
import { harSykefraværMedSkjæringstidspunkt } from '@state/inntektsforhold/arbeidsgiver';
import { arbeidsgiverTilReferanse } from '@state/inntektsforhold/inntektsforhold';
import { Refusjonsopplysning } from '@typer/overstyring';
import { DateString } from '@typer/shared';

import { endreInntektMedSykefraværÅrsaker, endreInntektUtenSykefraværÅrsaker } from './inntektOgRefusjonUtils';

interface InntektUtenSykefraværProps {
    person: ApiSaksbildePerson;
    skjæringstidspunkt: DateString;
    inntekt: ApiArbeidsgiverinntekt;
    vilkårsgrunnlagId?: string | null;
    inntektstype?: ApiInntektstype | null;
    arbeidsgiver: ApiArbeidsgiver;
    refusjon?: Refusjonsopplysning[] | null;
    inntekterForSammenligningsgrunnlag?: ApiInntektFraAOrdningen[];
    editing: boolean;
    setEditing: (isEditing: boolean) => void;
}

export const InntektOgRefusjon = ({
    person,
    skjæringstidspunkt,
    inntekt,
    vilkårsgrunnlagId,
    arbeidsgiver,
    refusjon,
    inntekterForSammenligningsgrunnlag,
    editing,
    setEditing,
}: InntektUtenSykefraværProps) => {
    const [endret, setEndret] = useState(false);

    const {
        omregnetArsinntekt: omregnetÅrsinntekt,
        arbeidsgiver: organisasjonsnummer,
        deaktivert: erDeaktivert,
    } = inntekt;

    const inntektFraAOrdningen = useInntekterFraAordningen(arbeidsgiver.organisasjonsnummer, skjæringstidspunkt);

    const harSykefravær = harSykefraværMedSkjæringstidspunkt(arbeidsgiver, skjæringstidspunkt);

    return (
        <>
            <HStack gap="space-8" align="center">
                <VisHvisSkrivetilgang>
                    <ToggleOverstyring
                        person={person}
                        skjæringstidspunkt={skjæringstidspunkt}
                        vilkårsgrunnlagId={vilkårsgrunnlagId}
                        organisasjonsnummer={organisasjonsnummer}
                        erDeaktivert={erDeaktivert ?? false}
                        editing={editing}
                        setEditing={setEditing}
                    />
                </VisHvisSkrivetilgang>
                {inntekt.deaktivert && <Tag variant="neutral">Brukes ikke i beregningen</Tag>}
            </HStack>
            <InntektOgRefusjonHeader arbeidsgiverReferanse={arbeidsgiverTilReferanse(arbeidsgiver)} kilde="AINNTEKT" />
            <Label size="small">Beregnet månedsinntekt</Label>
            {editing && omregnetÅrsinntekt && (
                <InntektOgRefusjonSkjema
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                    close={() => setEditing(false)}
                    harEndring={setEndret}
                    årsaker={harSykefravær ? endreInntektMedSykefraværÅrsaker : endreInntektUtenSykefraværÅrsaker}
                    skjæringstidspunkt={skjæringstidspunkt}
                    vilkårsgrunnlagId={vilkårsgrunnlagId}
                    person={person}
                    arbeidsgiver={arbeidsgiver}
                    inntektFom={inntekt.fom ?? null}
                    inntektTom={inntekt.tom ?? null}
                    erDeaktivert={erDeaktivert ?? false}
                    inntektFraAOrdningen={inntektFraAOrdningen}
                    inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
                />
            )}
            {!editing && (
                <InntektOgRefusjonVisning
                    person={person}
                    skjæringstidspunkt={skjæringstidspunkt}
                    omregnetÅrsinntekt={omregnetÅrsinntekt ?? null}
                    endret={endret}
                    refusjon={refusjon}
                    vilkårsgrunnlagId={vilkårsgrunnlagId}
                    inntektFraAOrdningen={inntektFraAOrdningen}
                    erDeaktivert={erDeaktivert ?? false}
                    inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
                    arbeidsgiver={arbeidsgiver}
                />
            )}
        </>
    );
};

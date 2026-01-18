import React, { useState } from 'react';

import { HStack, Label, Tag } from '@navikt/ds-react';

import { Arbeidsgiver, Arbeidsgiverinntekt, InntektFraAOrdningen, Inntektstype, PersonFragment } from '@io/graphql';
import { InntektOgRefusjonHeader } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/InntektOgRefusjonHeader';
import { InntektOgRefusjonVisning } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/InntektOgRefusjonVisning';
import { ToggleOverstyring } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/ToggleOverstyring';
import { InntektOgRefusjonSkjema } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/InntektOgRefusjonSkjema';
import { arbeidsgiverTilReferanse } from '@state/inntektsforhold/inntektsforhold';
import { Refusjonsopplysning } from '@typer/overstyring';
import { ActivePeriod } from '@typer/shared';

import {
    endreInntektMedSykefraværBegrunnelser,
    endreInntektUtenSykefraværBegrunnelser,
} from './inntektOgRefusjonUtils';

interface InntektUtenSykefraværProps {
    person: PersonFragment;
    periode: ActivePeriod;
    inntekt: Arbeidsgiverinntekt;
    vilkårsgrunnlagId?: string | null;
    inntektstype?: Inntektstype | null;
    arbeidsgiver: Arbeidsgiver;
    refusjon?: Refusjonsopplysning[] | null;
    inntekterForSammenligningsgrunnlag?: InntektFraAOrdningen[];
    editing: boolean;
    setEditing: (isEditing: boolean) => void;
}

export const InntektOgRefusjon = ({
    person,
    periode,
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

    const inntektFraAOrdningen = arbeidsgiver.inntekterFraAordningen.find(
        (it) => it.skjaeringstidspunkt === periode.skjaeringstidspunkt,
    )?.inntekter;

    const harSykefravær = !!arbeidsgiver?.behandlinger[0]?.perioder.find((it) => it.fom === periode.fom);

    return (
        <>
            <HStack gap="2" align="center">
                <ToggleOverstyring
                    person={person}
                    arbeidsgiver={arbeidsgiver}
                    periode={periode}
                    vilkårsgrunnlagId={vilkårsgrunnlagId}
                    organisasjonsnummer={organisasjonsnummer}
                    erDeaktivert={erDeaktivert ?? false}
                    editing={editing}
                    setEditing={setEditing}
                />
                {inntekt.deaktivert && <Tag variant="neutral">Brukes ikke i beregningen</Tag>}
            </HStack>
            <InntektOgRefusjonHeader arbeidsgiverReferanse={arbeidsgiverTilReferanse(arbeidsgiver)} kilde="AINNTEKT" />
            <Label size="small">Beregnet månedsinntekt</Label>
            {editing && omregnetÅrsinntekt && (
                <InntektOgRefusjonSkjema
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                    close={() => setEditing(false)}
                    harEndring={setEndret}
                    begrunnelser={
                        harSykefravær ? endreInntektMedSykefraværBegrunnelser : endreInntektUtenSykefraværBegrunnelser
                    }
                    skjæringstidspunkt={periode.skjaeringstidspunkt}
                    person={person}
                    arbeidsgiver={arbeidsgiver}
                    inntektFom={inntekt.fom}
                    inntektTom={inntekt.tom}
                    erDeaktivert={erDeaktivert ?? false}
                    inntektFraAOrdningen={inntektFraAOrdningen}
                    inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
                />
            )}
            {!editing && (
                <InntektOgRefusjonVisning
                    person={person}
                    periode={periode}
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                    endret={endret}
                    refusjon={refusjon}
                    vilkårsgrunnlagId={vilkårsgrunnlagId}
                    inntektFraAOrdningen={inntektFraAOrdningen}
                    erDeaktivert={erDeaktivert ?? false}
                    inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
                    harSykefravær={harSykefravær}
                    organisasjonsnummer={organisasjonsnummer}
                    overstyringer={arbeidsgiver.overstyringer}
                />
            )}
        </>
    );
};

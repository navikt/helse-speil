import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { Label } from '@navikt/ds-react';

import {
    ArbeidsgiverFragment,
    Arbeidsgiverinntekt,
    InntektFraAOrdningen,
    Inntektstype,
    Maybe,
    PersonFragment,
} from '@io/graphql';
import { InntektOgRefusjonHeader } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/InntektOgRefusjonHeader';
import { InntektOgRefusjonVisning } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/InntektOgRefusjonVisning';
import { ToggleOverstyring } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/ToggleOverstyring';
import { InntektOgRefusjonSkjema } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/InntektOgRefusjonSkjema';
import { Refusjonsopplysning } from '@typer/overstyring';
import { ActivePeriod } from '@typer/shared';

import {
    endreInntektMedSykefraværBegrunnelser,
    endreInntektUtenSykefraværBegrunnelser,
} from './inntektOgRefusjonUtils';

import styles from '../Inntekt.module.css';

interface InntektUtenSykefraværProps {
    person: PersonFragment;
    periode: ActivePeriod;
    inntekt: Arbeidsgiverinntekt;
    vilkårsgrunnlagId?: Maybe<string>;
    inntektstype?: Maybe<Inntektstype>;
    arbeidsgiver: ArbeidsgiverFragment;
    refusjon?: Maybe<Refusjonsopplysning[]>;
    harSykefravær: boolean;
    inntektFraAOrdningen?: Array<InntektFraAOrdningen>;
    inntekterForSammenligningsgrunnlag?: Array<InntektFraAOrdningen>;
}

export const InntektOgRefusjon = ({
    person,
    periode,
    inntekt,
    vilkårsgrunnlagId,
    arbeidsgiver,
    refusjon,
    harSykefravær,
    inntektFraAOrdningen,
    inntekterForSammenligningsgrunnlag,
}: InntektUtenSykefraværProps) => {
    const [editingInntekt, setEditingInntekt] = useState(false);
    const [endret, setEndret] = useState(false);

    const {
        omregnetArsinntekt: omregnetÅrsinntekt,
        arbeidsgiver: organisasjonsnummer,
        deaktivert: erDeaktivert,
    } = inntekt;

    useEffect(() => {
        setEditingInntekt(false);
    }, [periode.id]);

    return (
        <div
            className={classNames(styles.Inntekt, editingInntekt && styles.editing, erDeaktivert && styles.deaktivert)}
        >
            <ToggleOverstyring
                person={person}
                arbeidsgiver={arbeidsgiver}
                periode={periode}
                vilkårsgrunnlagId={vilkårsgrunnlagId}
                organisasjonsnummer={organisasjonsnummer}
                erDeaktivert={erDeaktivert ?? false}
                editing={editingInntekt}
                setEditing={setEditingInntekt}
            />
            <InntektOgRefusjonHeader
                arbeidsgivernavn={arbeidsgiver.navn}
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
            />
            <Label size="small">Beregnet månedsinntekt</Label>
            {editingInntekt && omregnetÅrsinntekt && (
                <InntektOgRefusjonSkjema
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                    close={() => setEditingInntekt(false)}
                    harEndring={setEndret}
                    begrunnelser={
                        harSykefravær ? endreInntektMedSykefraværBegrunnelser : endreInntektUtenSykefraværBegrunnelser
                    }
                    skjæringstidspunkt={periode.skjaeringstidspunkt}
                    person={person}
                    arbeidsgiver={arbeidsgiver}
                    inntektFom={inntekt.fom}
                    inntektTom={inntekt.tom}
                />
            )}

            {!editingInntekt && (
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
        </div>
    );
};

import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { useSkjønnsfastsettelsesMaler } from '@external/sanity';
import {
    Arbeidsgiverinntekt,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Maybe,
    PersonFragment,
    Sykepengegrunnlagsgrense,
} from '@io/graphql';
import {
    useAtomEditingForPersonOgSkjæringstidspunkt,
    useAtomSkjemaForPersonOgSkjæringstidspunkt,
} from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/atoms';
import {
    SkjønnsfastsettingForm,
    useAktiveArbeidsgivere,
} from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { isSykepengegrunnlagskjønnsfastsetting } from '@utils/typeguards';

import { SkjønnsfastsettingHeader } from './SkjønnsfastsettingHeader';
import { SkjønnsfastsettingSammendrag } from './SkjønnsfastsettingSammendrag';

import styles from './SkjønnsfastsettingSykepengegrunnlag.module.css';

interface SkjønnsfastsettingSykepengegrunnlagProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment | GhostPeriodeFragment;
    sykepengegrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    omregnetÅrsinntekt?: Maybe<number>;
    sammenligningsgrunnlag?: Maybe<number>;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
    inntekter: Arbeidsgiverinntekt[];
    avviksprosent: number;
    organisasjonsnummer: string;
}

export const SkjønnsfastsettingSykepengegrunnlag = ({
    person,
    periode,
    sykepengegrunnlag,
    sykepengegrunnlagsgrense,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    skjønnsmessigFastsattÅrlig,
    inntekter,
    avviksprosent,
    organisasjonsnummer,
}: SkjønnsfastsettingSykepengegrunnlagProps) => {
    const [editing, setEditing] = useAtomEditingForPersonOgSkjæringstidspunkt(periode.skjaeringstidspunkt);
    const [formValues, setFormValues] = useAtomSkjemaForPersonOgSkjæringstidspunkt(periode.skjaeringstidspunkt);
    const [endretSykepengegrunnlag, setEndretSykepengegrunnlag] = useState<Maybe<number>>(null);
    const aktiveArbeidsgivereMedOmregnetÅrsinntekt = useAktiveArbeidsgivere(person, periode, inntekter);
    const skalVise828andreLedd = avviksprosent > 25;

    const { maler, error } = useSkjønnsfastsettelsesMaler(
        skalVise828andreLedd,
        (aktiveArbeidsgivereMedOmregnetÅrsinntekt?.length ?? 0) > 1,
    );

    const closeAndResetForm = () => {
        setEditing(false);
        setFormValues(null);
    };

    useEffect(() => {
        setEndretSykepengegrunnlag(null);
    }, [editing]);

    const sisteSkjønnsfastsettelse =
        useCurrentArbeidsgiver(person)
            ?.overstyringer.filter(isSykepengegrunnlagskjønnsfastsetting)
            .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
            .pop() ?? null;

    return (
        <div key={periode.skjaeringstidspunkt} className={classNames(styles.formWrapper, editing && styles.redigerer)}>
            <SkjønnsfastsettingHeader
                person={person}
                sykepengegrunnlag={sykepengegrunnlag}
                endretSykepengegrunnlag={endretSykepengegrunnlag}
                sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                editing={editing}
                setEditing={setEditing}
                maler={maler}
                malerError={error?.message ? 'Mangler tekster for skjønnsfastsetting' : undefined}
                organisasjonsnummer={organisasjonsnummer}
                closeAndResetForm={closeAndResetForm}
            />
            {!editing && skjønnsmessigFastsattÅrlig !== null && sisteSkjønnsfastsettelse && (
                <SkjønnsfastsettingSammendrag sisteSkjønnsfastsetting={sisteSkjønnsfastsettelse} />
            )}
            {editing && maler && omregnetÅrsinntekt != null && sammenligningsgrunnlag != null && (
                <SkjønnsfastsettingForm
                    person={person}
                    periode={periode}
                    inntekter={inntekter}
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                    sammenligningsgrunnlag={sammenligningsgrunnlag}
                    sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                    onEndretSykepengegrunnlag={setEndretSykepengegrunnlag}
                    closeAndResetForm={closeAndResetForm}
                    maler={maler}
                    sisteSkjønnsfastsettelse={sisteSkjønnsfastsettelse}
                    formValues={formValues}
                    setFormValues={setFormValues}
                />
            )}
        </div>
    );
};

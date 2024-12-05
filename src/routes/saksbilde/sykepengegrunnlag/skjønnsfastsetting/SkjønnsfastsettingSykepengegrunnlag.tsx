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
import { SkjønnsfastsettingForm } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm';
import { useSkjønnsfastsettingDefaults } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/useSkjønnsfastsettingDefaults';

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
}: SkjønnsfastsettingSykepengegrunnlagProps) => {
    const [editing, setEditing] = useState(false);
    const [endretSykepengegrunnlag, setEndretSykepengegrunnlag] = useState<Maybe<number>>(null);
    const { aktiveArbeidsgivere } = useSkjønnsfastsettingDefaults(person, periode, inntekter);
    const skalVise828andreLedd = avviksprosent > 25;

    const { maler, error } = useSkjønnsfastsettelsesMaler(skalVise828andreLedd, (aktiveArbeidsgivere?.length ?? 0) > 1);

    useEffect(() => {
        setEndretSykepengegrunnlag(null);
    }, [editing]);

    return (
        <div className={classNames(styles.formWrapper, editing && styles.redigerer)}>
            <SkjønnsfastsettingHeader
                person={person}
                sykepengegrunnlag={sykepengegrunnlag}
                endretSykepengegrunnlag={endretSykepengegrunnlag}
                skjønnsmessigFastsattÅrlig={skjønnsmessigFastsattÅrlig}
                sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                editing={editing}
                setEditing={setEditing}
                maler={maler}
                malerError={error?.message ? 'Mangler tekster for skjønnsfastsetting' : undefined}
            />
            {!editing && skjønnsmessigFastsattÅrlig !== null && (
                <SkjønnsfastsettingSammendrag arbeidsgivere={person.arbeidsgivere} />
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
                    setEditing={setEditing}
                    maler={maler}
                />
            )}
        </div>
    );
};

import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { useSkjønnsfastsettelsesMaler } from '@external/sanity';
import { Arbeidsgiverinntekt, PersonFragment, Sykepengegrunnlagsgrense } from '@io/graphql';
import { Maybe } from '@utils/ts';

import { SykepengegrunnlagsgrenseView } from '../InntektsgrunnlagTable/SykepengegrunnlagsgrenseView/SykepengegrunnlagsgrenseView';
import { SkjønnsfastsettingHeader } from './SkjønnsfastsettingHeader';
import { SkjønnsfastsettingSammendrag } from './SkjønnsfastsettingSammendrag';
import { SkjønnsfastsettingForm } from './form/SkjønnsfastsettingForm/SkjønnsfastsettingForm';
import { useSkjønnsfastsettingDefaults } from './form/SkjønnsfastsettingForm/useSkjønnsfastsettingDefaults';

import styles from './SkjønnsfastsettingSykepengegrunnlag.module.css';

interface SkjønnsfastsettingSykepengegrunnlagProps {
    person: PersonFragment;
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
    const { aktiveArbeidsgivere } = useSkjønnsfastsettingDefaults(inntekter);

    // TODO: legg inn loading og error
    const { maler, loading, error } = useSkjønnsfastsettelsesMaler(
        avviksprosent,
        (aktiveArbeidsgivere?.length ?? 0) > 1,
    );

    useEffect(() => {
        setEndretSykepengegrunnlag(null);
    }, [editing]);

    return (
        <div>
            <div className={classNames(styles.formWrapper, { [styles.redigerer]: editing })}>
                <SkjønnsfastsettingHeader
                    sykepengegrunnlag={sykepengegrunnlag}
                    endretSykepengegrunnlag={endretSykepengegrunnlag}
                    skjønnsmessigFastsattÅrlig={skjønnsmessigFastsattÅrlig}
                    sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                    editing={editing}
                    setEditing={setEditing}
                    maler={maler}
                />
                {!editing && skjønnsmessigFastsattÅrlig !== null && (
                    <SkjønnsfastsettingSammendrag arbeidsgivere={person.arbeidsgivere} />
                )}
                {editing && maler && omregnetÅrsinntekt != null && sammenligningsgrunnlag != null && (
                    <SkjønnsfastsettingForm
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
            {omregnetÅrsinntekt != null && (
                <SykepengegrunnlagsgrenseView
                    sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                />
            )}
        </div>
    );
};

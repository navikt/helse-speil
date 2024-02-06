import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { Arbeidsgiverinntekt, Sykepengegrunnlagsgrense } from '@io/graphql';

import { SykepengegrunnlagsgrenseView } from '../InntektsgrunnlagTable/SykepengegrunnlagsgrenseView/SykepengegrunnlagsgrenseView';
import { SkjønnsfastsettingHeader } from './SkjønnsfastsettingHeader';
import { SkjønnsfastsettingSammendrag } from './SkjønnsfastsettingSammendrag';
import { SkjønnsfastsettingForm } from './form/SkjønnsfastsettingForm/SkjønnsfastsettingForm';

import styles from './SkjønnsfastsettingSykepengegrunnlag.module.css';

interface SkjønnsfastsettingSykepengegrunnlagProps {
    sykepengegrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    omregnetÅrsinntekt?: Maybe<number>;
    sammenligningsgrunnlag?: Maybe<number>;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
    inntekter: Arbeidsgiverinntekt[];
    avviksprosent: number;
}

export const SkjønnsfastsettingSykepengegrunnlag = ({
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
                    avviksprosent={avviksprosent}
                    editing={editing}
                    setEditing={setEditing}
                />
                {!editing && skjønnsmessigFastsattÅrlig !== null && <SkjønnsfastsettingSammendrag />}
                {editing && omregnetÅrsinntekt != null && sammenligningsgrunnlag != null && (
                    <SkjønnsfastsettingForm
                        inntekter={inntekter}
                        omregnetÅrsinntekt={omregnetÅrsinntekt}
                        sammenligningsgrunnlag={sammenligningsgrunnlag}
                        sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                        onEndretSykepengegrunnlag={setEndretSykepengegrunnlag}
                        setEditing={setEditing}
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

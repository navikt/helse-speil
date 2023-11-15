import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { Arbeidsgiverinntekt, Sykepengegrunnlagsgrense } from '@io/graphql';
import { kanSkjønnsfastsetteSykepengegrunnlag } from '@utils/featureToggles';

import { SykepengegrunnlagsgrenseView } from '../InntektsgrunnlagTable/SykepengegrunnlagsgrenseView/SykepengegrunnlagsgrenseView';
import { SkjønnsfastsettingHeader } from './SkjønnsfastsettingHeader';
import { SkjønnsfastsettingForm } from './form/SkjønnsfastsettingForm/SkjønnsfastsettingForm';

import styles from './SkjønnsfastsettingSykepengegrunnlag.module.css';

interface SkjønnsfastsettingSykepengegrunnlagProps {
    sykepengegrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    omregnetÅrsinntekt?: Maybe<number>;
    sammenligningsgrunnlag?: Maybe<number>;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
    inntekter: Arbeidsgiverinntekt[];
}

export const SkjønnsfastsettingSykepengegrunnlag = ({
    sykepengegrunnlag,
    sykepengegrunnlagsgrense,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    skjønnsmessigFastsattÅrlig,
    inntekter,
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
                    editing={editing}
                    setEditing={setEditing}
                />
                {editing &&
                    kanSkjønnsfastsetteSykepengegrunnlag &&
                    omregnetÅrsinntekt != null &&
                    sammenligningsgrunnlag != null && (
                        <SkjønnsfastsettingForm
                            inntekter={inntekter}
                            omregnetÅrsinntekt={omregnetÅrsinntekt}
                            sammenligningsgrunnlag={sammenligningsgrunnlag}
                            onEndretSykepengegrunnlag={setEndretSykepengegrunnlag}
                            setEditing={setEditing}
                        />
                    )}
            </div>
            {omregnetÅrsinntekt && (
                <SykepengegrunnlagsgrenseView
                    sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                />
            )}
        </div>
    );
};

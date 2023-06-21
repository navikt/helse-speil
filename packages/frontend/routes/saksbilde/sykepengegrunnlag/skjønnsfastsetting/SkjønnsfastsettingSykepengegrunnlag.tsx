import { SkjønnsfastsettingHeader } from './SkjønnsfastsettingHeader';
import classNames from 'classnames';
import React, { useState } from 'react';

import { Arbeidsgiverinntekt, Sykepengegrunnlagsgrense } from '@io/graphql';
import { kanSkjønnsfastsetteSykepengegrunnlag } from '@utils/featureToggles';

import { SykepengegrunnlagsgrenseView } from '../InntektsgrunnlagTable/SykepengegrunnlagsgrenseView/SykepengegrunnlagsgrenseView';

import styles from './SkjønnsfastsettingSykepengegrunnlag.module.css';

interface SkjønnsfastsettingSykepengegrunnlagProps {
    sykepengegrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    omregnetÅrsinntekt?: Maybe<number>;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
    inntekter: Arbeidsgiverinntekt[];
}

export const SkjønnsfastsettingSykepengegrunnlag = ({
    sykepengegrunnlag,
    sykepengegrunnlagsgrense,
    omregnetÅrsinntekt,
    skjønnsmessigFastsattÅrlig,
    inntekter,
}: SkjønnsfastsettingSykepengegrunnlagProps) => {
    const [editing, setEditing] = useState(false);

    return (
        <div>
            <div className={classNames(styles.formWrapper, { [styles.redigerer]: editing })}>
                <SkjønnsfastsettingHeader
                    sykepengegrunnlag={sykepengegrunnlag}
                    skjønnsmessigFastsattÅrlig={skjønnsmessigFastsattÅrlig}
                    editing={editing}
                    setEditing={setEditing}
                />
                {editing && kanSkjønnsfastsetteSykepengegrunnlag && <form>{/* Skjønnsfastsetting-form her */}</form>}
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

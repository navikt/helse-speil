import React, { Dispatch, SetStateAction } from 'react';

import { Arbeidsgiverinntekt, Sykepengegrunnlagsgrense } from '@io/graphql';

import { InntektsgrunnlagTable } from './InntektsgrunnlagTable';
import { InntektsgrunnlagoppsummeringTable } from './InntektsgrunnlagoppsummeringTable';

import styles from './SykepengegrunnlagPanel.module.css';

interface SykepengegrunnlagPanelProps {
    inntekter: Arbeidsgiverinntekt[];
    omregnetÅrsinntekt?: Maybe<number>;
    sammenligningsgrunnlag?: Maybe<number>;
    skjønnsmessigFastsattInntekt?: Maybe<number>;
    avviksprosent?: Maybe<number>;
    sykepengegrunnlag: number;
    setAktivInntektskilde: Dispatch<SetStateAction<Arbeidsgiverinntekt>>;
    aktivInntektskilde?: Arbeidsgiverinntekt;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
}

export const SykepengegrunnlagPanel = ({
    inntekter,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    avviksprosent,
    sykepengegrunnlag,
    setAktivInntektskilde,
    aktivInntektskilde,
    sykepengegrunnlagsgrense,
    skjønnsmessigFastsattInntekt,
}: SykepengegrunnlagPanelProps) => {
    return (
        <div className={styles.InntektsgrunnlagTable}>
            <InntektsgrunnlagTable
                inntekter={inntekter}
                setAktivInntektskilde={setAktivInntektskilde}
                aktivInntektskilde={aktivInntektskilde}
                omregnetÅrsinntekt={omregnetÅrsinntekt}
                skjønnsmessigFastsattInntekt={skjønnsmessigFastsattInntekt}
                sammenligningsgrunnlag={sammenligningsgrunnlag}
            />
            <InntektsgrunnlagoppsummeringTable
                omregnetÅrsinntekt={omregnetÅrsinntekt}
                sammenligningsgrunnlag={sammenligningsgrunnlag}
                avviksprosent={avviksprosent}
                sykepengegrunnlag={sykepengegrunnlag}
                sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
            />
        </div>
    );
};

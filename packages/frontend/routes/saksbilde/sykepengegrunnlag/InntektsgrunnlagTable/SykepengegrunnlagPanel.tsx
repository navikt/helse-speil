import React, { Dispatch, SetStateAction } from 'react';

import { Arbeidsgiverinntekt, Sykepengegrunnlagsgrense } from '@io/graphql';

import { SkjønnsfastsettingSykepengegrunnlag } from '../skjønnsfastsetting/SkjønnsfastsettingSykepengegrunnlag';
import { InntektsgrunnlagTable } from './InntektsgrunnlagTable';
import { InntektsgrunnlagoppsummeringTable } from './InntektsgrunnlagoppsummeringTable';

import styles from './SykepengegrunnlagPanel.module.css';

interface SykepengegrunnlagPanelProps {
    inntekter: Arbeidsgiverinntekt[];
    omregnetÅrsinntekt?: Maybe<number>;
    sammenligningsgrunnlag?: Maybe<number>;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
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
    skjønnsmessigFastsattÅrlig,
}: SykepengegrunnlagPanelProps) => {
    return (
        <div className={styles.wrapper}>
            <InntektsgrunnlagTable
                inntekter={inntekter}
                setAktivInntektskilde={setAktivInntektskilde}
                aktivInntektskilde={aktivInntektskilde}
                omregnetÅrsinntekt={omregnetÅrsinntekt}
                skjønnsmessigFastsattÅrlig={skjønnsmessigFastsattÅrlig}
                sammenligningsgrunnlag={sammenligningsgrunnlag}
            />
            <InntektsgrunnlagoppsummeringTable
                omregnetÅrsinntekt={omregnetÅrsinntekt}
                sammenligningsgrunnlag={sammenligningsgrunnlag}
                avviksprosent={avviksprosent}
            />
            <SkjønnsfastsettingSykepengegrunnlag
                sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                sykepengegrunnlag={sykepengegrunnlag}
                omregnetÅrsinntekt={omregnetÅrsinntekt}
                sammenligningsgrunnlag={sammenligningsgrunnlag}
                skjønnsmessigFastsattÅrlig={skjønnsmessigFastsattÅrlig}
                inntekter={inntekter}
                avviksprosent={avviksprosent ?? 0}
            />
        </div>
    );
};

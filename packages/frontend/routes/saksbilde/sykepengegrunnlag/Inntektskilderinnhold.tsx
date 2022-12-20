import React from 'react';

import type { Arbeidsgiverinntekt, Arbeidsgiverrefusjon } from '@io/graphql';

import { Inntekt } from './inntekt/Inntekt';

import styles from './Inntektskilderinnhold.module.css';

interface InntektskilderinnholdProps {
    inntekt: Arbeidsgiverinntekt;
    refusjon?: Maybe<Arbeidsgiverrefusjon>;
}

export const Inntektskilderinnhold = ({ inntekt, refusjon }: InntektskilderinnholdProps) => {
    return (
        <div className={styles.Inntektskilderinnhold}>
            <Inntekt inntekt={inntekt} refusjon={refusjon} />
        </div>
    );
};

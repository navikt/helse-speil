import classNames from 'classnames';
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
        <div className={classNames(styles.Inntektskilderinnhold, inntekt.deaktivert && styles.deaktivert)}>
            <Inntekt inntekt={inntekt} refusjon={refusjon} />
        </div>
    );
};

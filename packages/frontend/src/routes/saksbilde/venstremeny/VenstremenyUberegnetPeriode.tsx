import React from 'react';

import { Arbeidsgiver, UberegnetPeriode } from '@io/graphql';

import { PeriodeCard } from './PeriodeCard';

import styles from './Venstremeny.module.css';

interface VenstremenyUberegnetPeriodeProps {
    activePeriod: UberegnetPeriode;
    currentArbeidsgiver: Arbeidsgiver;
}

export const VenstremenyUberegnetPeriode: React.FC<VenstremenyUberegnetPeriodeProps> = ({
    activePeriod,
    currentArbeidsgiver,
}) => {
    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Uberegnet periode={activePeriod} arbeidsgiver={currentArbeidsgiver} />
        </section>
    );
};

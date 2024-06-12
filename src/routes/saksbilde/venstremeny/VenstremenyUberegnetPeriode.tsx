import React, { ReactElement } from 'react';

import { ArbeidsgiverFragment, UberegnetPeriodeFragment } from '@io/graphql';

import { PeriodeCard } from './PeriodeCard';

import styles from './Venstremeny.module.css';

interface VenstremenyUberegnetPeriodeProps {
    activePeriod: UberegnetPeriodeFragment;
    currentArbeidsgiver: ArbeidsgiverFragment;
}

export const VenstremenyUberegnetPeriode = ({
    activePeriod,
    currentArbeidsgiver,
}: VenstremenyUberegnetPeriodeProps): ReactElement => {
    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Uberegnet periode={activePeriod} arbeidsgiver={currentArbeidsgiver} />
        </section>
    );
};

import React, { ReactElement } from 'react';

import { ArbeidsgiverFragment, PersonFragment, UberegnetPeriodeFragment } from '@io/graphql';
import { HarBeslutteroppgaver } from '@saksbilde/venstremeny/HarBeslutteroppgaver';

import { PeriodeCard } from './PeriodeCard';

import styles from './Venstremeny.module.css';

interface VenstremenyUberegnetPeriodeProps {
    activePeriod: UberegnetPeriodeFragment;
    currentArbeidsgiver: ArbeidsgiverFragment;
    currentPerson: PersonFragment;
}

export const VenstremenyUberegnetPeriode = ({
    activePeriod,
    currentArbeidsgiver,
    currentPerson,
}: VenstremenyUberegnetPeriodeProps): ReactElement => {
    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Uberegnet periode={activePeriod} arbeidsgiver={currentArbeidsgiver} />
            <HarBeslutteroppgaver person={currentPerson} />
        </section>
    );
};

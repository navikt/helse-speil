import React, { ReactElement } from 'react';

import { ArbeidsgiverFragment, NyttInntektsforholdPeriodeFragment } from '@io/graphql';

import { PeriodeCard } from './PeriodeCard';

import styles from './Venstremeny.module.css';

interface VenstremenyNyttInntektsforholdPeriodeProps {
    activePeriod: NyttInntektsforholdPeriodeFragment;
    currentArbeidsgiver: ArbeidsgiverFragment;
}

export const VenstremenyNyttInntektsforholdPeriode = ({
    activePeriod,
    currentArbeidsgiver,
}: VenstremenyNyttInntektsforholdPeriodeProps): ReactElement => {
    if (!activePeriod.skjaeringstidspunkt) {
        throw Error('Mangler skjæringstidspunkt. Ta kontakt med en utvikler.');
    }

    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Tilkommen arbeidsgiver={currentArbeidsgiver} />
        </section>
    );
};

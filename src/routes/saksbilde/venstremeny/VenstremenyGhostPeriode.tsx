import React, { ReactElement } from 'react';

import { ArbeidsgiverFragment, GhostPeriodeFragment } from '@io/graphql';

import { PeriodeCard } from './PeriodeCard';

import styles from './Venstremeny.module.css';

interface VenstremenyGhostPeriodeProps {
    activePeriod: GhostPeriodeFragment;
    currentArbeidsgiver: ArbeidsgiverFragment;
}

export const VenstremenyGhostPeriode = ({
    activePeriod,
    currentArbeidsgiver,
}: VenstremenyGhostPeriodeProps): ReactElement => {
    if (!activePeriod.vilkarsgrunnlagId || !activePeriod.skjaeringstidspunkt) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Ghost arbeidsgiver={currentArbeidsgiver} />
        </section>
    );
};

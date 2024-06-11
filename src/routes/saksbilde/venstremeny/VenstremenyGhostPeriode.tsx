import React from 'react';

import { ArbeidsgiverFragment, GhostPeriodeFragment } from '@io/graphql';

import { PeriodeCard } from './PeriodeCard';

import styles from './Venstremeny.module.css';

interface VenstremenyGhostPeriodeProps {
    activePeriod: GhostPeriodeFragment;
    currentArbeidsgiver: ArbeidsgiverFragment;
}

export const VenstremenyGhostPeriode: React.FC<VenstremenyGhostPeriodeProps> = ({
    activePeriod,
    currentArbeidsgiver,
}) => {
    if (!activePeriod.vilkarsgrunnlagId || !activePeriod.skjaeringstidspunkt) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Ghost arbeidsgiver={currentArbeidsgiver} />
        </section>
    );
};

import React, { ReactElement } from 'react';

import { Arbeidsgiver, GhostPeriodeFragment } from '@io/graphql';

import { PeriodeCard } from './PeriodeCard';

import styles from './Venstremeny.module.css';

interface VenstremenyGhostPeriodeProps {
    activePeriod: GhostPeriodeFragment;
    currentArbeidsgiver: Arbeidsgiver;
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

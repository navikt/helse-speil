import React, { ReactElement } from 'react';

import { Arbeidsgiver, GhostPeriodeFragment } from '@io/graphql';
import { Inntektsforhold } from '@state/arbeidsgiver';

import { PeriodeCard } from './PeriodeCard';

import styles from './Venstremeny.module.css';

interface VenstremenyGhostPeriodeProps {
    activePeriod: GhostPeriodeFragment;
    currentArbeidsgiver: Arbeidsgiver;
    inntektsforhold: Inntektsforhold;
}

export const VenstremenyGhostPeriode = ({
    activePeriod,
    currentArbeidsgiver,
    inntektsforhold,
}: VenstremenyGhostPeriodeProps): ReactElement => {
    if (!activePeriod.vilkarsgrunnlagId || !activePeriod.skjaeringstidspunkt) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Ghost arbeidsgiver={currentArbeidsgiver} inntektsforhold={inntektsforhold} />
        </section>
    );
};

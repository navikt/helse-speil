import React, { ReactElement } from 'react';

import { ApiGhostPeriode } from '@io/rest/generated/spesialist.schemas';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';

import { PeriodeCard } from './PeriodeCard';

import styles from './Venstremeny.module.css';

interface VenstremenyGhostPeriodeProps {
    activePeriod: ApiGhostPeriode;
    inntektsforhold: Inntektsforhold;
}

export const VenstremenyGhostPeriode = ({
    activePeriod,
    inntektsforhold,
}: VenstremenyGhostPeriodeProps): ReactElement => {
    if (!activePeriod.vilkarsgrunnlagId || !activePeriod.skjaeringstidspunkt) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Ghost inntektsforhold={inntektsforhold} />
        </section>
    );
};

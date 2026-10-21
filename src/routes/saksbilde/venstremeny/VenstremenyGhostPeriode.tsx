import React, { ReactElement } from 'react';

import { ApiArbeidsgiver, ApiGhostPeriode } from '@io/rest/generated/spesialist.schemas';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';

import { PeriodeCard } from './PeriodeCard';

import styles from './Venstremeny.module.css';

interface VenstremenyGhostPeriodeProps {
    activePeriod: ApiGhostPeriode;
    currentArbeidsgiver: ApiArbeidsgiver;
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

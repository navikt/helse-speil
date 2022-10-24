import React from 'react';

import { Arbeidsgiver } from '@io/graphql';

import { ArbeidsgiverCard } from './ArbeidsgiverCard';

import styles from './Venstremeny.module.css';

interface VenstremenyGhostPeriodeProps {
    activePeriod: GhostPeriode;
    currentArbeidsgiver: Arbeidsgiver;
}

export const VenstremenyGhostPeriode: React.VFC<VenstremenyGhostPeriodeProps> = ({
    activePeriod,
    currentArbeidsgiver,
}) => {
    if (!activePeriod.vilkarsgrunnlaghistorikkId || !activePeriod.skjaeringstidspunkt) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    return (
        <section className={styles.Venstremeny}>
            <ArbeidsgiverCard.Ghost
                navn={currentArbeidsgiver.navn}
                organisasjonsnummer={currentArbeidsgiver.organisasjonsnummer}
                arbeidsforhold={currentArbeidsgiver.arbeidsforhold}
            />
        </section>
    );
};

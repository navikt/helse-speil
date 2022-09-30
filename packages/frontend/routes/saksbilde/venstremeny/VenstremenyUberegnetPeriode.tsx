import React from 'react';

import { Arbeidsgiver, UberegnetPeriode } from '@io/graphql';
import { useCurrentVilkårsgrunnlag } from '@state/periode';

import { ArbeidsgiverCard } from './ArbeidsgiverCard';
import { PeriodeCard } from './PeriodeCard';

import styles from './Venstremeny.module.css';

interface VenstremenyUberegnetPeriodeProps {
    activePeriod: UberegnetPeriode;
    currentArbeidsgiver: Arbeidsgiver;
}

export const VenstremenyUberegnetPeriode: React.FC<VenstremenyUberegnetPeriodeProps> = ({
    activePeriod,
    currentArbeidsgiver,
}) => {
    const månedsbeløp = useCurrentVilkårsgrunnlag()?.inntekter.find(
        (it) => it.arbeidsgiver === currentArbeidsgiver.organisasjonsnummer
    )?.omregnetArsinntekt?.manedsbelop;

    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Uberegnet periode={activePeriod} />
            <ArbeidsgiverCard.Uberegnet
                navn={currentArbeidsgiver.navn}
                organisasjonsnummer={currentArbeidsgiver.organisasjonsnummer}
                arbeidsforhold={currentArbeidsgiver.arbeidsforhold}
                månedsbeløp={månedsbeløp}
            />
        </section>
    );
};

import React, { ReactElement } from 'react';

import { PersonFragment, UberegnetPeriodeFragment } from '@io/graphql';
import { HarBeslutteroppgaver } from '@saksbilde/venstremeny/HarBeslutteroppgaver';
import { HarVurderbareVarsler } from '@saksbilde/venstremeny/HarVurderbareVarsler';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';

import { PeriodeCard } from './PeriodeCard';

import styles from './Venstremeny.module.css';

interface VenstremenyUberegnetPeriodeProps {
    activePeriod: UberegnetPeriodeFragment;
    inntektsforhold: Inntektsforhold;
    currentPerson: PersonFragment;
}

export const VenstremenyUberegnetPeriode = ({
    activePeriod,
    inntektsforhold,
    currentPerson,
}: VenstremenyUberegnetPeriodeProps): ReactElement => {
    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Uberegnet periode={activePeriod} inntektsforhold={inntektsforhold} />
            <HarVurderbareVarsler person={currentPerson} />
            <HarBeslutteroppgaver person={currentPerson} />
        </section>
    );
};

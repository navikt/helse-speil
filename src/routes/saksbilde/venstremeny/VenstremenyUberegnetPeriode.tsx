import React, { ReactElement } from 'react';

import { useHarBetabrukerrolle, useHarSkrivetilgang } from '@hooks/brukerrolleHooks';
import { PersonFragment, UberegnetPeriodeFragment } from '@io/graphql';
import { HarBeslutteroppgaver } from '@saksbilde/venstremeny/HarBeslutteroppgaver';
import { HarVurderbareVarsler } from '@saksbilde/venstremeny/HarVurderbareVarsler';
import { ForkastFraUberegnetButton } from '@saksbilde/venstremeny/utbetaling/ForkastFraUberegnetButton';
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
    const harBetabrukerrolle = useHarBetabrukerrolle();
    const harSkrivetilgang = useHarSkrivetilgang();
    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Uberegnet periode={activePeriod} inntektsforhold={inntektsforhold} />
            <HarVurderbareVarsler person={currentPerson} />
            <HarBeslutteroppgaver person={currentPerson} />
            {harBetabrukerrolle && harSkrivetilgang && <ForkastFraUberegnetButton activePeriod={activePeriod} />}
        </section>
    );
};

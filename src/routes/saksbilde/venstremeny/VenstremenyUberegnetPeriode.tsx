import React, { ReactElement } from 'react';

import { erUtvikling } from '@/env';
import { useHarBetabrukerrolle } from '@hooks/brukerrolleHooks';
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
    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Uberegnet periode={activePeriod} inntektsforhold={inntektsforhold} />
            <HarVurderbareVarsler person={currentPerson} />
            <HarBeslutteroppgaver person={currentPerson} />
            {(erUtvikling || harBetabrukerrolle) && <ForkastFraUberegnetButton activePeriod={activePeriod} />}
        </section>
    );
};

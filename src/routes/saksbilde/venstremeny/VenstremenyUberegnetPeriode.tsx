import React, { ReactElement } from 'react';

import { useErCoachFagkoordinatorEllerSupersaksbehandler, useHarSkrivetilgang } from '@hooks/brukerrolleHooks';
import { ApiPeriodetilstand, ApiSaksbildePerson, ApiUberegnetPeriode } from '@io/rest/generated/spesialist.schemas';
import { HarBeslutteroppgaver } from '@saksbilde/venstremeny/HarBeslutteroppgaver';
import { HarVurderbareVarsler } from '@saksbilde/venstremeny/HarVurderbareVarsler';
import { ForkastFraUberegnetButton } from '@saksbilde/venstremeny/utbetaling/ForkastFraUberegnetButton';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';

import { PeriodeCard } from './PeriodeCard';

import styles from './Venstremeny.module.css';

interface VenstremenyUberegnetPeriodeProps {
    activePeriod: ApiUberegnetPeriode;
    inntektsforhold: Inntektsforhold;
    currentPerson: ApiSaksbildePerson;
}

export const VenstremenyUberegnetPeriode = ({
    activePeriod,
    inntektsforhold,
    currentPerson,
}: VenstremenyUberegnetPeriodeProps): ReactElement => {
    const erCoachFagkoordinatorEllerSupersaksbehandler = useErCoachFagkoordinatorEllerSupersaksbehandler();
    const harSkrivetilgang = useHarSkrivetilgang();
    const skalViseForkastknapp =
        erCoachFagkoordinatorEllerSupersaksbehandler &&
        harSkrivetilgang &&
        (
            [
                ApiPeriodetilstand.AvventerInntektsopplysninger,
                ApiPeriodetilstand.ForberederGodkjenning,
                ApiPeriodetilstand.ManglerInformasjon,
                ApiPeriodetilstand.VenterPaEnAnnenPeriode,
                ApiPeriodetilstand.IngenUtbetaling,
            ] as ApiPeriodetilstand[]
        ).includes(activePeriod.periodetilstand);
    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Uberegnet periode={activePeriod} inntektsforhold={inntektsforhold} />
            <HarVurderbareVarsler person={currentPerson} />
            <HarBeslutteroppgaver person={currentPerson} />
            {skalViseForkastknapp && <ForkastFraUberegnetButton activePeriod={activePeriod} />}
        </section>
    );
};

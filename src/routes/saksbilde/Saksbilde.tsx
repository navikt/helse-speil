import React from 'react';

import { Alert } from '@navikt/ds-react';

import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import {
    Arbeidsforholdoverstyring,
    BeregnetPeriodeFragment,
    Maybe,
    Overstyring,
    Periodetilstand,
    PersonFragment,
} from '@io/graphql';
import { SaksbildeMenu } from '@saksbilde/saksbildeMenu/SaksbildeMenu';
import { PeriodeViewError } from '@saksbilde/saksbilder/PeriodeViewError';
import { PeriodeViewSkeleton } from '@saksbilde/saksbilder/PeriodeViewSkeleton';
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import { Saksbildevarsler } from '@saksbilde/varsler/Saksbildevarsler';
import { useHarDagOverstyringer } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { getLatestUtbetalingTimestamp, getOverstyringerForEksisterendePerioder } from '@state/utils';
import { ActivePeriod } from '@typer/shared';
import { getPeriodState } from '@utils/mapping';
import {
    isArbeidsforholdoverstyring,
    isBeregnetPeriode,
    isGhostPeriode,
    isSpleisVilkarsgrunnlag,
    isTilkommenInntekt,
    isUberegnetPeriode,
} from '@utils/typeguards';

import styles from './saksbilder/SharedViews.module.css';

interface SaksbildeProps {
    children?: React.ReactNode;
}

export const Saksbilde = ({ children }: SaksbildeProps) => {
    const { loading, data, error } = useFetchPersonQuery();

    const person: Maybe<PersonFragment> = data?.person ?? null;
    const activePeriod = useActivePeriod(person);

    if (loading) {
        return <PeriodeViewSkeleton />;
    }

    if (error || !activePeriod || !person) {
        return <PeriodeViewError />;
    }

    return (
        <div className={styles.Content}>
            <SaksbildeVarsel person={person} periode={activePeriod} />
            <SaksbildeMenu person={person} activePeriod={activePeriod} />
            {children}
        </div>
    );
};

interface SaksbildeVarselProps {
    person: PersonFragment;
    periode: ActivePeriod;
}

const SaksbildeVarsel = ({ person, periode }: SaksbildeVarselProps) => {
    if (isUberegnetPeriode(periode)) {
        return <Saksbildevarsler periodState={getPeriodState(periode)} varsler={periode.varsler} />;
    } else if (isAnnullertBeregnetPeriode(periode)) {
        return (
            <Alert variant="info" className={styles.Varsel}>
                Utbetalingen er annullert
            </Alert>
        );
    } else if (isTilAnnulleringBeregnetPeriode(periode)) {
        return (
            <Alert variant="info" className={styles.Varsel}>
                Utbetalingen er sendt til annullering
            </Alert>
        );
    } else if (!periode.skjaeringstidspunkt || !periode.vilkarsgrunnlagId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    } else if (isBeregnetPeriode(periode)) {
        return <BeregnetSaksbildevarsler periode={periode as BeregnetPeriodeFragment} person={person} />;
    } else if (isGhostPeriode(periode)) {
        return (
            <Saksbildevarsler periodState={getPeriodState(periode)} skjæringstidspunkt={periode.skjaeringstidspunkt} />
        );
    } else if (isTilkommenInntekt(periode)) {
        return (
            <Saksbildevarsler periodState={getPeriodState(periode)} skjæringstidspunkt={periode.skjaeringstidspunkt} />
        );
    }
};

const useOverstyringerEtterSisteGodkjenteUtbetaling = (person: PersonFragment): Array<Overstyring> => {
    const timestamp = getLatestUtbetalingTimestamp(person);
    return getOverstyringerForEksisterendePerioder(person, timestamp);
};

const useNavnPåDeaktiverteGhostArbeidsgivere = (person: PersonFragment, periode: BeregnetPeriodeFragment) => {
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, periode);
    return isSpleisVilkarsgrunnlag(vilkårsgrunnlag)
        ? person.arbeidsgivere
              .filter((arbeidsgiver) =>
                  arbeidsgiver.overstyringer.find(
                      (overstyring) =>
                          isArbeidsforholdoverstyring(overstyring) &&
                          !(overstyring as Arbeidsforholdoverstyring).ferdigstilt,
                  ),
              )
              .flatMap((arbeidsgiver) => arbeidsgiver.navn)
              .join(', ')
        : undefined;
};

interface BeregnetSaksbildevarslerProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
}

const BeregnetSaksbildevarsler = ({ person, periode }: BeregnetSaksbildevarslerProps) => {
    const erTidligereSaksbehandler = useErTidligereSaksbehandler(person);
    const overstyringerEtterNyesteUtbetalingPåPerson = useOverstyringerEtterSisteGodkjenteUtbetaling(person);
    const harDagOverstyringer = useHarDagOverstyringer(periode, person);
    const navnPåDeaktiverteGhostArbeidsgivere = useNavnPåDeaktiverteGhostArbeidsgivere(person, periode);

    return (
        <Saksbildevarsler
            periodState={getPeriodState(periode)}
            oppgavereferanse={periode.oppgave?.id}
            varsler={periode.varsler}
            erTidligereSaksbehandler={erTidligereSaksbehandler}
            erBeslutteroppgave={periode.totrinnsvurdering?.erBeslutteroppgave}
            endringerEtterNyesteUtbetalingPåPerson={overstyringerEtterNyesteUtbetalingPåPerson}
            harDagOverstyringer={harDagOverstyringer}
            activePeriodTom={periode.tom}
            skjæringstidspunkt={periode.skjaeringstidspunkt}
            navnPåDeaktiverteGhostArbeidsgivere={navnPåDeaktiverteGhostArbeidsgivere}
        />
    );
};

const isAnnullertBeregnetPeriode = (activePeriod: ActivePeriod) =>
    isBeregnetPeriode(activePeriod) && activePeriod.periodetilstand === Periodetilstand.Annullert;

const isTilAnnulleringBeregnetPeriode = (activePeriod: ActivePeriod) =>
    isBeregnetPeriode(activePeriod) && activePeriod.periodetilstand === Periodetilstand.TilAnnullering;

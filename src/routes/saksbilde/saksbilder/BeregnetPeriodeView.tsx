import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';
import { last } from 'remeda';

import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { Arbeidsforholdoverstyring, BeregnetPeriodeFragment, Overstyring, PersonFragment } from '@io/graphql';
import { SaksbildeMenu } from '@saksbilde/saksbildeMenu/SaksbildeMenu';
import { Sykepengegrunnlag } from '@saksbilde/sykepengegrunnlag/Sykepengegrunnlag';
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import { TilkommenInntekt } from '@saksbilde/tilkommenInntekt/TilkommenInntekt';
import { Utbetaling } from '@saksbilde/utbetaling/Utbetaling';
import { Saksbildevarsler } from '@saksbilde/varsler/Saksbildevarsler';
import { Inngangsvilkår } from '@saksbilde/vilkår/Inngangsvilkår';
import { Vurderingsmomenter } from '@saksbilde/vurderingsmomenter/Vurderingsmomenter';
import { useHarDagOverstyringer } from '@state/arbeidsgiver';
import { getLatestUtbetalingTimestamp, getOverstyringerForEksisterendePerioder } from '@state/utils';
import { getPeriodState } from '@utils/mapping';
import { isArbeidsforholdoverstyring, isSpleisVilkarsgrunnlag } from '@utils/typeguards';

import styles from './SharedViews.module.css';

const useOverstyringerEtterSisteGodkjenteUtbetaling = (person: PersonFragment): Array<Overstyring> => {
    const timestamp = getLatestUtbetalingTimestamp(person);
    return getOverstyringerForEksisterendePerioder(person, timestamp);
};

interface BeregnetPeriodeViewProps {
    period: BeregnetPeriodeFragment;
    person: PersonFragment;
}

export const BeregnetPeriodeView = ({ period, person }: BeregnetPeriodeViewProps): ReactElement => {
    if (!period.skjaeringstidspunkt || !period.vilkarsgrunnlagId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    const erTidligereSaksbehandler = useErTidligereSaksbehandler(person);
    const overstyringerEtterNyesteUtbetalingPåPerson = useOverstyringerEtterSisteGodkjenteUtbetaling(person);
    const harDagOverstyringer = useHarDagOverstyringer(period, person);
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, period);
    const tab = last(usePathname().split('/'));
    const navnPåDeaktiverteGhostArbeidsgivere = isSpleisVilkarsgrunnlag(vilkårsgrunnlag)
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

    return (
        <div className={styles.Content}>
            <Saksbildevarsler
                periodState={getPeriodState(period)}
                oppgavereferanse={period.oppgave?.id}
                varsler={period.varsler}
                erTidligereSaksbehandler={erTidligereSaksbehandler}
                erBeslutteroppgave={period.totrinnsvurdering?.erBeslutteroppgave}
                endringerEtterNyesteUtbetalingPåPerson={overstyringerEtterNyesteUtbetalingPåPerson}
                harDagOverstyringer={harDagOverstyringer}
                activePeriodTom={period.tom}
                skjæringstidspunkt={period.skjaeringstidspunkt}
                navnPåDeaktiverteGhostArbeidsgivere={navnPåDeaktiverteGhostArbeidsgivere}
            />
            <SaksbildeMenu person={person} activePeriod={period} />
            <div className={styles.RouteContainer}>
                {tab === 'dagoversikt' && <Utbetaling person={person} />}
                {decodeURI(tab ?? '') === 'inngangsvilkår' && <Inngangsvilkår />}
                {tab === 'sykepengegrunnlag' && <Sykepengegrunnlag person={person} />}
                {tab === 'vurderingsmomenter' && <Vurderingsmomenter person={person} />}
                {tab === 'tilkommen-inntekt' && <TilkommenInntekt person={person} aktivPeriode={period} />}
            </div>
        </div>
    );
};

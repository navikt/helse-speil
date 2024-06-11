import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';
import { last } from 'remeda';

import Sykepengegrunnlag from '@/routes/saksbilde/sykepengegrunnlag/Sykepengegrunnlag';
import Utbetaling from '@/routes/saksbilde/utbetaling/Utbetaling';
import Inngangsvilkår from '@/routes/saksbilde/vilkår/Inngangsvilkår';
import Vurderingsmomenter from '@/routes/saksbilde/vurderingsmomenter/Vurderingsmomenter';
import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { Arbeidsforholdoverstyring, BeregnetPeriodeFragment, Overstyring, PersonFragment } from '@io/graphql';
import { getLatestUtbetalingTimestamp, getOverstyringerForEksisterendePerioder } from '@person/utils';
import { useHarDagOverstyringer } from '@state/arbeidsgiver';
import { getPeriodState } from '@utils/mapping';
import { isArbeidsforholdoverstyring, isSpleisVilkarsgrunnlag } from '@utils/typeguards';

import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';
import { useVilkårsgrunnlag } from '../sykepengegrunnlag/useVilkårsgrunnlag';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';

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

    const erTidligereSaksbehandler = useErTidligereSaksbehandler();
    const overstyringerEtterNyesteUtbetalingPåPerson = useOverstyringerEtterSisteGodkjenteUtbetaling(person);
    const harDagOverstyringer = useHarDagOverstyringer(period);
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
            <SaksbildeMenu activePeriod={period} />
            <div className={styles.RouteContainer}>
                {tab === 'dagoversikt' && <Utbetaling />}
                {decodeURI(tab ?? '') === 'inngangsvilkår' && <Inngangsvilkår />}
                {tab === 'sykepengegrunnlag' && <Sykepengegrunnlag />}
                {tab === 'vurderingsmomenter' && <Vurderingsmomenter />}
            </div>
        </div>
    );
};

export default BeregnetPeriodeView;

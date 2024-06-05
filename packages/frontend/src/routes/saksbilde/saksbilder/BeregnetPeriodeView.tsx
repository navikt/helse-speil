import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import React, { Suspense } from 'react';

import { Heading, Loader } from '@navikt/ds-react';

import Sykepengegrunnlag from '@/routes/saksbilde/sykepengegrunnlag/Sykepengegrunnlag';
import Utbetaling from '@/routes/saksbilde/utbetaling/Utbetaling';
import Inngangsvilkår from '@/routes/saksbilde/vilkår/Inngangsvilkår';
import Vurderingsmomenter from '@/routes/saksbilde/vurderingsmomenter/Vurderingsmomenter';
import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { Arbeidsforholdoverstyring, Overstyring } from '@io/graphql';
import { useHarDagOverstyringer } from '@state/arbeidsgiver';
import { getLatestUtbetalingTimestamp, getOverstyringerForEksisterendePerioder } from '@state/selectors/person';
import { onLazyLoadFail } from '@utils/error';
import { getPeriodState } from '@utils/mapping';
import { isArbeidsforholdoverstyring, isSpleisVilkarsgrunnlag } from '@utils/typeguards';

import { Historikk } from '../historikk';
import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';
import { useVilkårsgrunnlag } from '../sykepengegrunnlag/useVilkårsgrunnlag';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Venstremeny } from '../venstremeny/Venstremeny';

import styles from './SharedViews.module.css';

const useOverstyringerEtterSisteGodkjenteUtbetaling = (person: FetchedPerson): Array<Overstyring> => {
    const timestamp = getLatestUtbetalingTimestamp(person);
    return getOverstyringerForEksisterendePerioder(person, timestamp);
};

interface BeregnetPeriodeViewProps {
    period: FetchedBeregnetPeriode;
    person: FetchedPerson;
}

export const BeregnetPeriodeView: React.FC<BeregnetPeriodeViewProps> = ({ period, person }) => {
    if (!period.skjaeringstidspunkt || !period.vilkarsgrunnlagId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    const erTidligereSaksbehandler = useErTidligereSaksbehandler();
    const overstyringerEtterNyesteUtbetalingPåPerson = useOverstyringerEtterSisteGodkjenteUtbetaling(person);
    const harDagOverstyringer = useHarDagOverstyringer(period);
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, period);
    const { tab } = useParams<{ tab: string }>();
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
            <SaksbildeMenu />
            <div className={styles.RouteContainer}>
                {tab === 'dagoversikt' && <Utbetaling />}
                {decodeURI(tab) === 'inngangsvilkår' && <Inngangsvilkår />}
                {tab === 'sykepengegrunnlag' && <Sykepengegrunnlag />}
                {tab === 'vurderingsmomenter' && <Vurderingsmomenter />}
            </div>
        </div>
    );
};

export default BeregnetPeriodeView;

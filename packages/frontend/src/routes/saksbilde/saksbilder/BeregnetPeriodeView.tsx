import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import React from 'react';

import { Loader } from '@navikt/ds-react';

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

import styles from './PeriodeView.module.css';

const Utbetaling = dynamic(() =>
    import('../utbetaling/Utbetaling').then((res) => ({ default: res.Utbetaling })).catch(onLazyLoadFail),
);
const Inngangsvilkår = dynamic(() =>
    import('../vilkår/Inngangsvilkår').then((res) => ({ default: res.Inngangsvilkår })).catch(onLazyLoadFail),
);
const Vurderingsmomenter = dynamic(() =>
    import('../vurderingsmomenter/Vurderingsmomenter')
        .then((res) => ({ default: res.Vurderingsmomenter }))
        .catch(onLazyLoadFail),
);
const Sykepengegrunnlag = dynamic(() =>
    import('../sykepengegrunnlag/Sykepengegrunnlag')
        .then((res) => ({ default: res.Sykepengegrunnlag }))
        .catch(onLazyLoadFail),
);

const BeregnetPeriodeViewLoader: React.FC = () => {
    return (
        <div className={styles.Skeleton}>
            <Loader size="xlarge" />
        </div>
    );
};

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
        <>
            <Venstremeny />
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
                    <React.Suspense fallback={<BeregnetPeriodeViewLoader />}>
                        {tab === 'dagoversikt' && <Utbetaling />}
                        {decodeURI(tab) === 'inngangsvilkår' && <Inngangsvilkår />}
                        {tab === 'sykepengegrunnlag' && <Sykepengegrunnlag />}
                        {tab === 'vurderingsmomenter' && <Vurderingsmomenter />}
                    </React.Suspense>
                </div>
            </div>
            <Historikk />
        </>
    );
};

export default BeregnetPeriodeView;

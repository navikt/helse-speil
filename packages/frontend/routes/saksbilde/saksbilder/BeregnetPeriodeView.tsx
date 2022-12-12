import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Loader } from '@navikt/ds-react';

import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { useHarVurderLovvalgOgMedlemskapVarsel } from '@hooks/useHarVurderLovvalgOgMedlemskapVarsel';
import { Overstyring } from '@io/graphql';
import { useHarDagOverstyringer } from '@state/arbeidsgiver';
import { useSyncNotater } from '@state/notater';
import { getLatestUtbetalingTimestamp, getOverstyringer } from '@state/selectors/person';
import { onLazyLoadFail } from '@utils/error';
import { getPeriodState } from '@utils/mapping';

import { Historikk } from '../historikk';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Venstremeny } from '../venstremeny/Venstremeny';

import styles from './PeriodeView.module.css';

const Utbetaling = React.lazy(() => import('../utbetaling/Utbetaling').catch(onLazyLoadFail));
const Inngangsvilkår = React.lazy(() => import('../vilkår/Inngangsvilkår').catch(onLazyLoadFail));
const Faresignaler = React.lazy(() => import('../faresignaler/Faresignaler').catch(onLazyLoadFail));
const Sykepengegrunnlag = React.lazy(() => import('../sykepengegrunnlag/Sykepengegrunnlag').catch(onLazyLoadFail));

const BeregnetPeriodeViewLoader: React.FC = () => {
    return (
        <div className={styles.Skeleton}>
            <Loader size="xlarge" />
        </div>
    );
};

const useOverstyringerEtterSisteGodkjenteUtbetaling = (person: FetchedPerson): Array<Overstyring> => {
    const timestamp = getLatestUtbetalingTimestamp(person);
    return getOverstyringer(person, timestamp);
};

interface BeregnetPeriodeViewProps {
    period: FetchedBeregnetPeriode;
    person: FetchedPerson;
}

export const BeregnetPeriodeView: React.FC<BeregnetPeriodeViewProps> = ({ period, person }) => {
    console.log('Antall varsler ', period.varsler.length);
    console.log('Antall varslerForGenerasjon ', period.varslerForGenerasjon.length);

    if (!period.skjaeringstidspunkt || !period.vilkarsgrunnlagId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    const { path } = useRouteMatch();

    useSyncNotater([period.vedtaksperiodeId]);

    const erTidligereSaksbehandler = useErTidligereSaksbehandler();
    const harVurderLovvalgOgMedlemskapVarsel = useHarVurderLovvalgOgMedlemskapVarsel();
    const overstyringerEtterNyesteUtbetalingPåPerson = useOverstyringerEtterSisteGodkjenteUtbetaling(person);
    const harDagOverstyringer = useHarDagOverstyringer(period);

    return (
        <>
            <Venstremeny />
            <div className={styles.Content}>
                <Saksbildevarsler
                    periodState={getPeriodState(period)}
                    oppgavereferanse={period.oppgave?.id}
                    varsler={period.varsler}
                    varslerForGenerasjon={period.varslerForGenerasjon}
                    erTidligereSaksbehandler={erTidligereSaksbehandler}
                    periodeMedBrukerutbetaling={period.utbetaling.personNettoBelop !== 0}
                    erBeslutteroppgave={period.oppgave?.erBeslutter}
                    harVurderLovvalgOgMedlemskapVarsel={harVurderLovvalgOgMedlemskapVarsel}
                    endringerEtterNyesteUtbetalingPåPerson={overstyringerEtterNyesteUtbetalingPåPerson}
                    harDagOverstyringer={harDagOverstyringer}
                    activePeriodTom={period.tom}
                />
                <div className={styles.RouteContainer}>
                    <Switch>
                        <React.Suspense fallback={<BeregnetPeriodeViewLoader />}>
                            <Route path={`${path}/utbetaling`}>
                                <Utbetaling />
                            </Route>
                            <Route path={`${path}/inngangsvilkår`}>
                                <Inngangsvilkår />
                            </Route>
                            <Route path={`${path}/sykepengegrunnlag`}>
                                <Sykepengegrunnlag />
                            </Route>
                            <Route path={`${path}/faresignaler`}>
                                <Faresignaler />
                            </Route>
                        </React.Suspense>
                    </Switch>
                </div>
            </div>
            <Historikk />
        </>
    );
};

export default BeregnetPeriodeView;

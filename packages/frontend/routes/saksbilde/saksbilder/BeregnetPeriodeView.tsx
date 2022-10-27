import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Loader } from '@navikt/ds-react';

import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { useHarVurderLovvalgOgMedlemskapVarsel } from '@hooks/useHarVurderLovvalgOgMedlemskapVarsel';
import { useHarDagOverstyringer } from '@state/arbeidsgiver';
import { useSyncNotater } from '@state/notater';
import { useEndringerEtterNyesteUtbetaltetidsstempel } from '@state/person';
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

interface BeregnetPeriodeViewProps {
    activePeriod: FetchedBeregnetPeriode;
}

export const BeregnetPeriodeView: React.FC<BeregnetPeriodeViewProps> = ({ activePeriod }) => {
    if (!activePeriod.skjaeringstidspunkt || !activePeriod.vilkarsgrunnlagId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    const { path } = useRouteMatch();

    useSyncNotater([activePeriod.vedtaksperiodeId]);

    const erTidligereSaksbehandler = useErTidligereSaksbehandler();
    const harVurderLovvalgOgMedlemskapVarsel = useHarVurderLovvalgOgMedlemskapVarsel();
    const saksbehandlerendringerEtterNyesteUtbetalingPåPerson = useEndringerEtterNyesteUtbetaltetidsstempel();
    const harDagOverstyringer = useHarDagOverstyringer(activePeriod);

    return (
        <>
            <Venstremeny />
            <div className={styles.Content}>
                <Saksbildevarsler
                    periodState={getPeriodState(activePeriod)}
                    oppgavereferanse={activePeriod.oppgave?.id}
                    varsler={activePeriod.varsler}
                    erTidligereSaksbehandler={erTidligereSaksbehandler}
                    periodeMedBrukerutbetaling={activePeriod.utbetaling.personNettoBelop !== 0}
                    erBeslutteroppgave={activePeriod.oppgave?.erBeslutter}
                    harVurderLovvalgOgMedlemskapVarsel={harVurderLovvalgOgMedlemskapVarsel}
                    endringerEtterNyesteUtbetalingPåPerson={saksbehandlerendringerEtterNyesteUtbetalingPåPerson}
                    harDagOverstyringer={harDagOverstyringer}
                    activePeriodTom={activePeriod.tom}
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

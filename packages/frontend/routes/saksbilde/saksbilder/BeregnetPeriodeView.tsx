import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Loader } from '@navikt/ds-react';

import { useSyncNotater } from '@state/notater';
import { onLazyLoadFail } from '@utils/error';
import { getPeriodState } from '@utils/mapping';
import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { Arbeidsgiver, BeregnetPeriode, Person } from '@io/graphql';

import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Venstremeny } from '../venstremeny/Venstremeny';
import { Historikk } from '../historikk';

import styles from './PeriodeView.module.css';
import { useHarVurderLovvalgOgMedlemskapVarsel } from '@hooks/useHarVurderLovvalgOgMedlemskapVarsel';
import { useEndringerEtterNyesteUtbetaltetidsstempel } from '@state/person';
import { useHarDagOverstyringer } from '@state/arbeidsgiver';

const Utbetaling = React.lazy(() => import('../utbetaling/Utbetaling').catch(onLazyLoadFail));
const Inngangsvilkår = React.lazy(() => import('../vilkår/Inngangsvilkår').catch(onLazyLoadFail));
const Faresignaler = React.lazy(() => import('../faresignaler/Faresignaler').catch(onLazyLoadFail));
const Sykepengegrunnlag = React.lazy(() => import('../sykepengegrunnlag/Sykepengegrunnlag').catch(onLazyLoadFail));

const BeregnetPeriodeViewLoader: React.VFC = () => {
    return (
        <div className={styles.Skeleton}>
            <Loader size="xlarge" />
        </div>
    );
};

interface BeregnetPeriodeViewProps {
    activePeriod: BeregnetPeriode;
    currentPerson: Person;
    currentArbeidsgiver: Arbeidsgiver;
}

export const BeregnetPeriodeView: React.VFC<BeregnetPeriodeViewProps> = ({ activePeriod }) => {
    if (!activePeriod.skjaeringstidspunkt || !activePeriod.vilkarsgrunnlaghistorikkId) {
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
            <div className={styles.Content} data-testid="saksbilde-content-med-sykefravær">
                <Saksbildevarsler
                    periodState={getPeriodState(activePeriod)}
                    oppgavereferanse={activePeriod.oppgavereferanse}
                    varsler={activePeriod.varsler}
                    erTidligereSaksbehandler={erTidligereSaksbehandler}
                    erBeslutteroppgave={activePeriod.erBeslutterOppgave}
                    harVurderLovvalgOgMedlemskapVarsel={harVurderLovvalgOgMedlemskapVarsel}
                    endringerEtterNyesteUtbetalingPåPerson={saksbehandlerendringerEtterNyesteUtbetalingPåPerson}
                    harDagOverstyringer={harDagOverstyringer}
                    activePeriodTom={activePeriod.tom}
                />
                <Switch>
                    <React.Suspense fallback={<BeregnetPeriodeViewLoader />}>
                        <Route path={`${path}/utbetaling`}>
                            <Utbetaling />
                        </Route>
                        <Route path={`${path}/inngangsvilkår`}>
                            <div className={styles.RouteContainer}>
                                <Inngangsvilkår />
                            </div>
                        </Route>
                        <Route path={`${path}/sykepengegrunnlag`}>
                            <div className={styles.RouteContainer}>
                                <Sykepengegrunnlag />
                            </div>
                        </Route>
                        <Route path={`${path}/faresignaler`}>
                            <div className={styles.RouteContainer}>
                                <Faresignaler />
                            </div>
                        </Route>
                    </React.Suspense>
                </Switch>
            </div>
            <Historikk />
        </>
    );
};

export default BeregnetPeriodeView;

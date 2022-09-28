import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Loader } from '@navikt/ds-react';

import { onLazyLoadFail } from '@utils/error';
import { getPeriodState } from '@utils/mapping';
import { useSyncNotater } from '@state/notater';
import { useHarDagOverstyringer } from '@state/arbeidsgiver';
import { useEndringerEtterNyesteUtbetaltetidsstempel } from '@state/person';
import { Arbeidsgiver, BeregnetPeriode, Person } from '@io/graphql';
import { useHarVurderLovvalgOgMedlemskapVarsel } from '@hooks/useHarVurderLovvalgOgMedlemskapVarsel';
import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';

import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Venstremeny } from '../venstremeny/Venstremeny';
import { Historikk } from '../historikk';

import styles from './PeriodeView.module.css';

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
            <div className={styles.Content}>
                <Saksbildevarsler
                    periodState={getPeriodState(activePeriod)}
                    oppgavereferanse={activePeriod.oppgavereferanse}
                    varsler={activePeriod.varsler}
                    erTidligereSaksbehandler={erTidligereSaksbehandler}
                    periodeMedBrukerutbetaling={activePeriod.utbetaling.personNettoBelop !== 0}
                    erBeslutteroppgave={activePeriod.erBeslutterOppgave}
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

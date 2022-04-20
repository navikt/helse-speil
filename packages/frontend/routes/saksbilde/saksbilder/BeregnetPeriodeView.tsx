import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { getPeriodState } from '@utils/mapping';
import { Arbeidsgiver, BeregnetPeriode, Person } from '@io/graphql';

import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Venstremeny } from '../venstremeny/Venstremeny';
import { Historikk } from '../historikk/Historikk';

import styles from './PeriodeView.module.css';

const Utbetaling = React.lazy(() => import('../utbetaling/Utbetaling'));
const Inngangsvilkår = React.lazy(() => import('../vilkår/Inngangsvilkår'));
const Faresignaler = React.lazy(() => import('../faresignaler/Faresignaler'));
const Sykepengegrunnlag = React.lazy(() => import('../sykepengegrunnlag/Sykepengegrunnlag'));

interface BeregnetPeriodeViewProps {
    activePeriod: BeregnetPeriode;
    currentPerson: Person;
    currentArbeidsgiver: Arbeidsgiver;
}

export const BeregnetPeriodeView: React.VFC<BeregnetPeriodeViewProps> = ({ activePeriod, currentPerson }) => {
    if (!activePeriod.skjaeringstidspunkt || !activePeriod.vilkarsgrunnlaghistorikkId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    const { path } = useRouteMatch();

    return (
        <>
            <Venstremeny />
            <div className={styles.Content} data-testid="saksbilde-content-med-sykefravær">
                <Saksbildevarsler
                    periodState={getPeriodState(activePeriod)}
                    oppgavereferanse={activePeriod.oppgavereferanse}
                    varsler={activePeriod.varsler}
                />
                {activePeriod.tilstand !== 'Annullert' && (
                    <Switch>
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
                    </Switch>
                )}
            </div>
            <Historikk />
        </>
    );
};

export default BeregnetPeriodeView;

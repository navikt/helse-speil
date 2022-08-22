import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Location } from '@hooks/useNavigation';
import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import type { GhostPeriode, Person } from '@io/graphql';
import { getPeriodState } from '@utils/mapping';

import { Historikk } from '../historikk';
import { Venstremeny } from '../venstremeny/Venstremeny';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';

import styles from './PeriodeView.module.css';

interface GhostPeriodeViewProps {
    activePeriod: GhostPeriode;
    currentPerson: Person;
}

export const GhostPeriodeView: React.VFC<GhostPeriodeViewProps> = ({ activePeriod, currentPerson }) => {
    if (!activePeriod.skjaeringstidspunkt || !activePeriod.vilkarsgrunnlaghistorikkId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    const { path } = useRouteMatch();
    useNavigateOnMount(Location.Sykepengegrunnlag, currentPerson.aktorId);

    return (
        <>
            <Venstremeny />
            <div className={styles.Content} data-testid="saksbilde-content-uten-sykefravær">
                <Saksbildevarsler periodState={getPeriodState(activePeriod)} />
                <Switch>
                    <Route path={`${path}/sykepengegrunnlag`}>
                        <div className={styles.RouteContainer}>
                            <Sykepengegrunnlag />
                        </div>
                    </Route>
                </Switch>
            </div>
            <Historikk />
        </>
    );
};

export default GhostPeriodeView;

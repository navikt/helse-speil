import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Location } from '@hooks/useNavigation';
import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import type { Arbeidsgiver, GhostPeriode, Person } from '@io/graphql';

import { Historikk } from '../historikk/Historikk';
import { Venstremeny } from '../venstremeny/Venstremeny';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';

import styles from './PeriodeView.module.css';

interface GhostPeriodeViewProps {
    activePeriod: GhostPeriode;
    currentPerson: Person;
    currentArbeidsgiver: Arbeidsgiver;
}

export const GhostPeriodeView: React.VFC<GhostPeriodeViewProps> = ({
    activePeriod,
    currentPerson,
    currentArbeidsgiver,
}) => {
    if (!activePeriod.skjaeringstidspunkt || !activePeriod.vilkarsgrunnlaghistorikkId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    const { path } = useRouteMatch();

    useNavigateOnMount(Location.Sykepengegrunnlag, currentPerson.aktorId);

    return (
        <>
            <Venstremeny />
            <div className={styles.Content} data-testid="saksbilde-content-uten-sykefravær">
                <Saksbildevarsler activePeriod={activePeriod} />
                <Switch>
                    <Route path={`${path}/sykepengegrunnlag`}>
                        <Sykepengegrunnlag />
                    </Route>
                </Switch>
            </div>
            <Historikk />
        </>
    );
};

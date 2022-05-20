import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Location } from '@hooks/useNavigation';
import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { useSetVedtaksperiodeReferanserForNotater } from '@hooks/useSetVedtaksperiodeReferanserForNotater';
import type { Arbeidsgiver, GhostPeriode, Person } from '@io/graphql';
import { getPeriodState } from '@utils/mapping';

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

    useSetVedtaksperiodeReferanserForNotater([activePeriod.id]);
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

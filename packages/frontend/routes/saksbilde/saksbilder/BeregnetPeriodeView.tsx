import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Arbeidsgiver, BeregnetPeriode, Person } from '@io/graphql';

import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Venstremeny } from '../venstremeny/Venstremeny';
import { Historikk } from '../historikk/Historikk';
import { Utbetaling } from '../utbetaling/Utbetaling';
import { Inngangsvilkår } from '../vilkår/Inngangsvilkår';

import styles from './PeriodeView.module.css';
import { Faresignaler } from '../faresignaler/Faresignaler';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';

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
                <Saksbildevarsler activePeriod={activePeriod} />
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
                                <Sykepengegrunnlag
                                    skjæringstidspunkt={activePeriod.skjæringstidspunkt}
                                    vilkårsgrunnlaghistorikkId={activePeriod.vilkårsgrunnlaghistorikkId}
                                    refusjon={refusjon}
                                />
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

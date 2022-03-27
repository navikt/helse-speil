import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Arbeidsgiver, BeregnetPeriode, Person } from '@io/graphql';

import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Venstremeny } from '../venstremeny/Venstremeny';
import { Historikk } from '../historikk/Historikk';
import { Utbetaling } from '../utbetaling/Utbetaling';
import { Faresignaler } from '../faresignaler/Faresignaler';
import { RouteContainer } from './SaksbildeFullstendigPeriode';
import { Inngangsvilkår } from '../vilkår/Inngangsvilkår';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';

import styles from './PeriodeView.module.css';

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
                        {/*<Route path={`${path}/inngangsvilkår`}>*/}
                        {/*    <RouteContainer>*/}
                        {/*        <Inngangsvilkår*/}
                        {/*            skjæringstidspunkt={aktivPeriode.skjæringstidspunkt}*/}
                        {/*            vilkårsgrunnlagHistorikkId={aktivPeriode.vilkårsgrunnlaghistorikkId}*/}
                        {/*        />*/}
                        {/*    </RouteContainer>*/}
                        {/*</Route>*/}
                        {/*<Route path={`${path}/sykepengegrunnlag`}>*/}
                        {/*    <RouteContainer>*/}
                        {/*        <Sykepengegrunnlag*/}
                        {/*            skjæringstidspunkt={aktivPeriode.skjæringstidspunkt}*/}
                        {/*            vilkårsgrunnlaghistorikkId={aktivPeriode.vilkårsgrunnlaghistorikkId}*/}
                        {/*            refusjon={refusjon}*/}
                        {/*        />*/}
                        {/*    </RouteContainer>*/}
                        {/*</Route>*/}
                        {/*{vedtaksperiode?.risikovurdering && (*/}
                        {/*    <Route path={`${path}/faresignaler`}>*/}
                        {/*        <RouteContainer>*/}
                        {/*            <Faresignaler risikovurdering={vedtaksperiode.risikovurdering} />*/}
                        {/*        </RouteContainer>*/}
                        {/*    </Route>*/}
                        {/*)}*/}
                    </Switch>
                )}
            </div>
            <Historikk />
        </>
    );
};

import React, { useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Tooltip } from '@components/Tooltip';
import { Location, useNavigation } from '@hooks/useNavigation';
import { useVilkårsgrunnlaghistorikk } from '@state/person';

import { VenstreMenyUtenSykefravær } from '../venstremeny/VenstremenyUtenSykefravær';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';
import { Content, RouteContainer } from './SaksbildeFullstendigPeriode';
import { Historikk } from '../historikk/Historikk';

interface SaksbildeFullstendigPeriodeUtenSykefraværProps {
    personTilBehandling: Person;
    aktivPeriode: TidslinjeperiodeUtenSykefravær;
}

export const SaksbildeFullstendigPeriodeUtenSykefravær = ({
    personTilBehandling,
    aktivPeriode,
}: SaksbildeFullstendigPeriodeUtenSykefraværProps) => {
    const { path } = useRouteMatch();
    const { navigateTo } = useNavigation();

    useEffect(() => {
        navigateTo(Location.Sykepengegrunnlag, personTilBehandling.aktørId);
    }, []);

    if (!aktivPeriode.skjæringstidspunkt || !aktivPeriode.vilkårsgrunnlaghistorikkId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    const omregnetÅrsinntekt =
        useVilkårsgrunnlaghistorikk(
            aktivPeriode.skjæringstidspunkt,
            aktivPeriode.vilkårsgrunnlaghistorikkId
        )?.inntekter.find((inntekt) => inntekt.organisasjonsnummer === aktivPeriode.organisasjonsnummer)
            ?.omregnetÅrsinntekt ?? null;

    return (
        <>
            <VenstreMenyUtenSykefravær
                organisasjonsnummer={aktivPeriode.organisasjonsnummer}
                omregnetÅrsinntekt={omregnetÅrsinntekt}
                deaktivert={aktivPeriode.deaktivert}
            />
            <Content className="RouteContainer" data-testid="saksbilde-content-uten-sykefravær">
                <Saksbildevarsler activePeriod={aktivPeriode} />
                <Switch>
                    <Route path={`${path}/sykepengegrunnlag`}>
                        <RouteContainer>
                            <Sykepengegrunnlag
                                skjæringstidspunkt={aktivPeriode.skjæringstidspunkt}
                                vilkårsgrunnlaghistorikkId={aktivPeriode.vilkårsgrunnlaghistorikkId}
                            />
                        </RouteContainer>
                    </Route>
                </Switch>
            </Content>
            <Historikk tildeling={personTilBehandling.tildeling} personinfo={personTilBehandling.personinfo} />
            <Tooltip effect="solid" />
        </>
    );
};

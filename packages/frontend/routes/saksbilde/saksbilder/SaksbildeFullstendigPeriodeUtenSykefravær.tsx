import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Location, useNavigation } from '../../../hooks/useNavigation';
import React, { useEffect } from 'react';
import { useVilkårsgrunnlaghistorikk } from '../../../state/person';
import { VenstreMenyUtenSykefravær } from '../venstremeny/Venstremeny';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';
import { Tooltip } from '../../../components/Tooltip';
import { Content, RouteContainer } from './SaksbildeFullstendigPeriode';

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

    const månedsbeløp = useVilkårsgrunnlaghistorikk(
        aktivPeriode.skjæringstidspunkt,
        aktivPeriode.vilkårsgrunnlaghistorikkId
    )?.inntekter.find((inntekt) => inntekt.organisasjonsnummer === aktivPeriode.organisasjonsnummer)?.omregnetÅrsinntekt
        ?.månedsbeløp;

    return (
        <>
            <VenstreMenyUtenSykefravær
                aktivPeriode={aktivPeriode as TidslinjeperiodeUtenSykefravær}
                organisasjonsnummer={aktivPeriode.organisasjonsnummer}
                månedsbeløp={månedsbeløp}
            />
            <Content className="Content" data-testid="saksbilde-content">
                <Saksbildevarsler aktivPeriode={aktivPeriode} />
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
            <Tooltip effect="solid" />
        </>
    );
};

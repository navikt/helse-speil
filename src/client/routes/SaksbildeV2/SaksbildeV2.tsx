import React, { useContext } from 'react';
import { Flex } from '../../components/Flex';
import { TabLink } from './TabLink';
import { Tidslinje } from '../../components/tidslinje';
import { Sakslinje } from './Sakslinje';
import { Personlinje } from '../../components/Personlinje';
import { PersonContext } from '../../context/PersonContext';
import { useRefetchPersonOnUrlChange } from '../../hooks/useRefetchPersonOnUrlChange';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

export const SaksbildeV2 = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const { path, url } = useRouteMatch();

    useRefetchPersonOnUrlChange();

    if (!aktivVedtaksperiode || !personTilBehandling) return <div />;

    return (
        <div>
            <Personlinje person={personTilBehandling} />
            <Tidslinje person={personTilBehandling} aktivVedtaksperiode={aktivVedtaksperiode} />
            <Flex>
                <Sakslinje>
                    <TabLink to={`${url}/utbetaling`}>Utbetaling</TabLink>
                    <TabLink to={`${url}/sykmeldingsperiode`}>Sykmeldingsperiode</TabLink>
                    <TabLink to={`${url}/vilkår`}>Vilkår</TabLink>
                    <TabLink to={`${url}/sykepengegrunnlag`}>Sykepengegrunnlag</TabLink>
                </Sakslinje>
            </Flex>
            <Switch>
                <Route path={`${path}/utbetaling`}></Route>
                <Route path={`${path}/sykmeldingsperiode`}></Route>
                <Route path={`${path}/vilkår`}></Route>
                <Route path={`${path}/sykepengegrunnlag`}></Route>
            </Switch>
        </div>
    );
};

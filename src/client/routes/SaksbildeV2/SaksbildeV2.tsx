import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Flex } from '../../components/Flex';
import { TabLink } from './TabLink';
import { Tidslinje } from '../../components/tidslinje';
import { Sakslinje } from './Sakslinje';
import { Personlinje } from '../../components/Personlinje';
import { PersonContext } from '../../context/PersonContext';
import { useRefetchPersonOnUrlChange } from '../../hooks/useRefetchPersonOnUrlChange';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Vilkår } from './Vilkår/Vilkår';
import { Utbetaling } from './Utbetaling/Utbetaling';
import { Sykepengegrunnlag } from './Sykepengegrunnlag/Sykepengegrunnlag';
import { Sykmeldingsperiode } from './Sykmeldingsperiode/Sykmeldingsperiode';

const Content = styled.div`
    margin: 2rem;
`;

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
                <Route path={`${path}/utbetaling`}>
                    <Content>
                        <Utbetaling />
                    </Content>
                </Route>
                <Route path={`${path}/sykmeldingsperiode`}>
                    <Content>
                        <Sykmeldingsperiode />
                    </Content>
                </Route>
                <Route path={`${path}/vilkår`}>
                    <Content>
                        <Vilkår />
                    </Content>
                </Route>
                <Route path={`${path}/sykepengegrunnlag`}>
                    <Content>
                        <Sykepengegrunnlag />
                    </Content>
                </Route>
            </Switch>
        </div>
    );
};

import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Flex, FlexColumn } from '../../components/Flex';
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
import { Toppvarsler } from '../../components/Toppvarsler';
import LoggProvider from '../../context/logg/LoggProvider';
import { LoggHeader as EksternLoggheader, LoggListe as EksternLoggliste } from '@navikt/helse-frontend-logg';
import '@navikt/helse-frontend-logg/lib/main.css';
import { Periodetype } from '../../components/sakslinje/Periodetype';
import { Verktøylinje } from './Verktøylinje';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const Content = styled.div`
    margin: 2rem;
`;

const LoggHeader = styled(EksternLoggheader)`
    width: 336px;
    box-sizing: border-box;
    border-left: 1px solid #c6c2bf;
    box-shadow: inset 0 -1px 0 0 #c6c2bf;
`;

const LoggListe = styled(EksternLoggliste)`
    width: 336px;
    box-sizing: border-box;
    border-left: 1px solid #c6c2bf;
    border-top: none;

    .Sykmelding:before,
    .Søknad:before,
    .Inntektsmelding:before {
        position: absolute;
        font-size: 14px;
        border: 1px solid #59514b;
        color: #59514b;
        border-radius: 4px;
        width: 28px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
        box-sizing: border-box;
        left: 0;
    }

    .Sykmelding:before {
        content: 'SM';
    }

    .Søknad:before {
        content: 'SØ';
    }

    .Inntektsmelding:before {
        content: 'IM';
    }
`;

const SakslinjeVenstre = styled(Flex)`
    width: 18rem;
    margin-right: 1rem;
    align-items: center;
`;

export const SaksbildeV2 = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const { path, url } = useRouteMatch();

    useRefetchPersonOnUrlChange();

    if (!aktivVedtaksperiode || !personTilBehandling) return <div />;

    return (
        <Container className="saksbilde">
            <LoggProvider>
                <Personlinje person={personTilBehandling} />
                <Tidslinje person={personTilBehandling} aktivVedtaksperiode={aktivVedtaksperiode} />
                <Flex justifyContent="space-between">
                    <Sakslinje>
                        <SakslinjeVenstre>
                            <Periodetype tittel={aktivVedtaksperiode.periodetype} />
                            <Verktøylinje />
                        </SakslinjeVenstre>
                        <TabLink to={`${url}/utbetaling`}>Utbetaling</TabLink>
                        <TabLink to={`${url}/sykmeldingsperiode`}>Sykmeldingsperiode</TabLink>
                        <TabLink to={`${url}/vilkår`}>Vilkår</TabLink>
                        <TabLink to={`${url}/sykepengegrunnlag`}>Sykepengegrunnlag</TabLink>
                    </Sakslinje>
                    <LoggHeader />
                </Flex>
                <Flex style={{ flex: 1 }}>
                    <FlexColumn style={{ flex: 1 }}>
                        <Toppvarsler />
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
                    </FlexColumn>
                    <LoggListe />
                </Flex>
            </LoggProvider>
        </Container>
    );
};

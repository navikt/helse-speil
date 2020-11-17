import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Flex, FlexColumn } from '../../components/Flex';
import { Tidslinje } from '../../components/tidslinje';
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
import { Sakslinje } from './sakslinje/Sakslinje';
import { KalkulererOverstyringToast } from './Sykmeldingsperiode/KalkulererOverstyringToast';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
`;

const Content = styled.div`
    margin: 0 2.5rem 4rem 2rem;
    height: 100%;
`;

const LoggHeader = styled(EksternLoggheader)`
    width: 336px;
    box-sizing: border-box;
    border-left: 1px solid #c6c2bf;
    box-shadow: inset 0 -1px 0 0 #c6c2bf;
    height: 91px;
`;

const LoggListe = styled(EksternLoggliste)`
    width: 336px;
    box-sizing: border-box;
    border-left: 1px solid #c6c2bf;
    border-top: none;
    margin-bottom: 4rem;

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

export const Saksbilde = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const { path } = useRouteMatch();

    useRefetchPersonOnUrlChange();

    if (!personTilBehandling) return <div />;

    return (
        <Container className="saksbilde">
            <LoggProvider>
                <Personlinje person={personTilBehandling} />
                <Tidslinje person={personTilBehandling} aktivVedtaksperiode={aktivVedtaksperiode} />
                <Flex justifyContent="space-between">
                    <Sakslinje />
                    <LoggHeader />
                </Flex>
                <Flex style={{ flex: 1 }}>
                    <FlexColumn style={{ flex: 1 }}>
                        <Toppvarsler />
                        <Content>
                            <Switch>
                                <Route path={`${path}/utbetaling`}>
                                    <Utbetaling />
                                </Route>
                                <Route path={`${path}/sykmeldingsperiode`}>
                                    <Sykmeldingsperiode />
                                </Route>
                                <Route path={`${path}/vilkår`}>
                                    <Vilkår />
                                </Route>
                                <Route path={`${path}/sykepengegrunnlag`}>
                                    <Sykepengegrunnlag />
                                </Route>
                            </Switch>
                        </Content>
                    </FlexColumn>
                    <LoggListe />
                </Flex>
            </LoggProvider>
            <KalkulererOverstyringToast />
        </Container>
    );
};

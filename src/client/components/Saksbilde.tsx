import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Route } from 'react-router-dom';
import Vilkår from '../routes/Vilkår';
import PersonBar from './PersonBar';
import Tidslinje from './Tidslinje';
import Høyremeny from './Høyremeny';
import Sakslinje from './Sakslinje';
import Venstremeny from './Venstremeny';
import Oppsummering from '../routes/Oppsummering';
import EmptyStateView from './EmptyStateView';
import Inntektskilder from '../routes/Inntektskilder/Inntektskilder';
import Sykepengegrunnlag from '../routes/Sykepengegrunnlag';
import Sykmeldingsperiode from '../routes/Sykmeldingsperiode';
import Utbetalingsoversikt from '../routes/Utbetalingsoversikt';
import LoggProvider from '../context/LoggProvider';
import { PersonContext } from '../context/PersonContext';
import { Location, useNavigation } from '../hooks/useNavigation';
import Toppvarsler from './Toppvarsler';

const Container = styled.div`
    display: flex;
    flex: 1;
    min-width: max-content;
    box-sizing: border-box;
`;

const Hovedinnhold = styled.div`
    flex: 1;
    overflow-x: scroll;
`;

const TomtSaksbilde = () => (
    <>
        <PersonBar />
        <Tidslinje />
        <Sakslinje />
        <Container>
            <Venstremeny />
            <EmptyStateView />
            <Høyremeny />
        </Container>
    </>
);

const Saksbilde = () => {
    const { toString } = useNavigation();
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);

    if (!personTilBehandling || !aktivVedtaksperiode) return <TomtSaksbilde />;

    return (
        <>
            <PersonBar />
            <Tidslinje />
            <LoggProvider>
                <Sakslinje />
                <Container>
                    <Venstremeny />
                    <Hovedinnhold>
                        <Toppvarsler />
                        <Route
                            path={`${toString(Location.Sykmeldingsperiode)}/:aktoerId`}
                            component={Sykmeldingsperiode}
                        />
                        <Route path={`${toString(Location.Vilkår)}/:aktoerId`} component={() => <Vilkår />} />
                        <Route path={`${toString(Location.Inntektskilder)}/:aktoerId`} component={Inntektskilder} />
                        <Route
                            path={`${toString(Location.Sykepengegrunnlag)}/:aktoerId`}
                            component={Sykepengegrunnlag}
                        />
                        <Route
                            path={`${toString(Location.Utbetalingsoversikt)}/:aktoerId`}
                            component={Utbetalingsoversikt}
                        />
                        <Route path={`${toString(Location.Oppsummering)}/:aktoerId`} component={Oppsummering} />
                    </Hovedinnhold>
                    <Høyremeny />
                </Container>
            </LoggProvider>
        </>
    );
};

export default Saksbilde;

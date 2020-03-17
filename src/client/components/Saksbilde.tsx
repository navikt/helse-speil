import React, { useContext } from 'react';
import Venstremeny from './Venstremeny';
import PersonBar from './PersonBar';
import Fordeling from '../routes/Fordeling';
import Oppsummering from '../routes/Oppsummering';
import Vilkår from '../routes/Vilkår';
import EmptyStateView from './EmptyStateView';
import Inntektskilder from '../routes/Inntektskilder/Inntektskilder';
import Sykepengegrunnlag from '../routes/Sykepengegrunnlag';
import Sykmeldingsperiode from '../routes/Sykmeldingsperiode';
import Utbetalingsoversikt from '../routes/Utbetalingsoversikt';
import { Route } from 'react-router-dom';
import { pages } from '../hooks/useLinks';
import { PersonContext } from '../context/PersonContext';
import Tidslinje from './Tidslinje';
import Høyremeny from './Høyremeny';
import styled from '@emotion/styled';
import Vedtaksperiodeinfo from './Vedtaksperiodeinfo';

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

const Saksbilde = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);

    if (!personTilBehandling) {
        return (
            <>
                <PersonBar />
                <Tidslinje />
                <Container>
                    <Venstremeny />
                    <EmptyStateView />
                    <Høyremeny />
                </Container>
            </>
        );
    }

    return (
        <>
            <PersonBar />
            <Tidslinje />
            <Container>
                <Venstremeny />
                <Hovedinnhold>
                    <Vedtaksperiodeinfo periode={aktivVedtaksperiode} person={personTilBehandling} />
                    <Route path={`/${pages.SYKMELDINGSPERIODE}/:aktoerId`} component={Sykmeldingsperiode} />
                    <Route path={`/${pages.VILKÅR}/:aktoerId`} component={Vilkår} />
                    <Route path={`/${pages.INNTEKTSKILDER}/:aktoerId`} component={Inntektskilder} />
                    <Route path={`/${pages.SYKEPENGEGRUNNLAG}/:aktoerId`} component={Sykepengegrunnlag} />
                    <Route path={`/${pages.FORDELING}/:aktoerId`} component={Fordeling} />
                    <Route path={`/${pages.UTBETALINGSOVERSIKT}/:aktoerId`} component={Utbetalingsoversikt} />
                    <Route path={`/${pages.OPPSUMMERING}/:aktoerId`} component={Oppsummering} />
                </Hovedinnhold>
                <Høyremeny />
            </Container>
        </>
    );
};

export default Saksbilde;

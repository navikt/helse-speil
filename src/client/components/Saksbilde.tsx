import React, { useContext } from 'react';
import Vilkår from '../routes/Vilkår';
import PersonBar from './PersonBar';
import Tidslinje from './Tidslinje';
import Høyremeny from './Høyremeny';
import Fordeling from '../routes/Fordeling';
import Sakslinje from '@navikt/helse-frontend-sakslinje';
import Venstremeny from './Venstremeny';
import Oppsummering from '../routes/Oppsummering';
import EmptyStateView from './EmptyStateView';
import Inntektskilder from '../routes/Inntektskilder/Inntektskilder';
import Sykepengegrunnlag from '../routes/Sykepengegrunnlag';
import Vedtaksperiodeinfo from './Vedtaksperiodeinfo';
import Sykmeldingsperiode from '../routes/Sykmeldingsperiode';
import Utbetalingsoversikt from '../routes/Utbetalingsoversikt';
import { Route } from 'react-router-dom';
import { pages } from '../hooks/useLinks';
import { PersonContext } from '../context/PersonContext';
import styled from '@emotion/styled';
import { Hendelse } from '../context/types';
import { Hendelsetype, LoggHeader, LoggProvider } from '@navikt/helse-frontend-logg';
import dayjs from 'dayjs';

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

const StyledSakslinje = styled(Sakslinje)`
    border: none;
    border-bottom: 1px solid #c6c2bf;
    > *:first-child {
        width: 250px;
    }
    > *:last-child {
        width: 210px;
    }
`;

const typeForHendelse = (hendelse: Hendelse) => {
    switch (hendelse.type) {
        case 'INNTEKTSMELDING':
        case 'SENDT_SØKNAD':
        case 'NY_SØKNAD':
            return Hendelsetype.Dokumenter;
        default:
            return Hendelsetype.Historikk;
    }
};

const navnForHendelse = (hendelse: Hendelse) => {
    switch (hendelse.type) {
        case 'INNTEKTSMELDING':
            return 'Inntektsmelding mottatt';
        case 'SENDT_SØKNAD':
            return 'Søknad mottatt';
        case 'NY_SØKNAD':
            return 'Sykmelding mottatt';
        default:
            return 'Hendelse';
    }
};

const datoForHendelse = (hendelse: Hendelse) => {
    const dato = hendelse.rapportertdato || hendelse.mottattDato;
    return dato ? dayjs(dato).format('DD.MM.YYYY') : 'Ukjent dato';
};

const Saksbilde = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);

    const hendelser = personTilBehandling?.hendelser.map(hendelsen => ({
        id: `${hendelsen.type}-${hendelsen.fom}`,
        dato: datoForHendelse(hendelsen),
        navn: navnForHendelse(hendelsen),
        type: typeForHendelse(hendelsen)
    }));

    if (!personTilBehandling) {
        return (
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
    }

    return (
        <>
            <PersonBar />
            <Tidslinje />
            <LoggProvider hendelser={hendelser}>
                <StyledSakslinje
                    venstre={<div />}
                    midt={<Vedtaksperiodeinfo periode={aktivVedtaksperiode} person={personTilBehandling} />}
                    høyre={<LoggHeader />}
                />
                <Container>
                    <Venstremeny />
                    <Hovedinnhold>
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
            </LoggProvider>
        </>
    );
};

export default Saksbilde;

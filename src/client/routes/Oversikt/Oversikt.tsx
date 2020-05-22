import React, { useContext, useEffect, useState } from 'react';
import Oversiktslinje from './Oversiktslinje';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Panel from 'nav-frontend-paneler';
import { TildelingerContext } from '../../context/TildelingerContext';
import { BehovContext } from '../../context/BehovContext';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import { useTranslation } from 'react-i18next';
import { Oppgave } from '../../../types';
import styled from '@emotion/styled';
import { Header, Row, Tabell } from './Oversikt.styles';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';

const Container = styled(Panel)`
    margin: 1rem;
    padding: 1rem;
    color: #3e3832;
`;

const Sorteringsknapp = styled.button`
    padding: 0 1rem 0 0;
    background: none;
    outline: none;
    border: none;
    display: flex;
    align-items: center;
    cursor: pointer;
`;

const Sorteringspiler = styled.div<{ direction: string }>`
    pointer-events: none;
    position: relative;
    height: 0.75rem;
    margin-left: 0.5rem;

    &:before,
    &:after {
        pointer-events: none;
        content: '';
        border-left: 0.25rem solid white;
        border-right: 0.25rem solid white;
        position: absolute;
        transition: all 0.1s ease;
    }

    &:before {
        border-bottom: 0.25rem solid #b7b1a9;
        transition: all 0.1s ease;
    }

    &:after {
        border-top: 0.25rem solid #3e3832;
        bottom: 0;
        transition: all 0.1s ease;
    }

    ${(props) =>
        props.direction === 'ascending' &&
        `
        &:after { transform: translateY(-0.5rem) rotate(180deg); }
        &:before { transform: translateY(0.5rem) rotate(180deg); }
    `}
`;

const ascending = (a: Oppgave, b: Oppgave) => a.antallVarsler - b.antallVarsler;
const descending = (a: Oppgave, b: Oppgave) => b.antallVarsler - a.antallVarsler;

const Oversikt = () => {
    const { t } = useTranslation();
    const { behov, hentBehov, isFetchingBehov } = useContext(BehovContext);
    const { tildelBehandling, tildelinger, tildelingError, fetchTildelinger, fjernTildeling } = useContext(
        TildelingerContext
    );
    const [sortDirection, setSortDirection] = useState<(a: Oppgave, b: Oppgave) => number>(() => ascending);
    const harAlleTildelinger = tildelinger.length == behov.length;

    useEffect(() => {
        if (!harAlleTildelinger) {
            fetchTildelinger(behov);
        }
    }, [behov]);

    useEffect(() => {
        hentBehov();
    }, []);

    const toggleSortDirection = () =>
        setSortDirection(sortDirection === descending ? () => ascending : () => descending);

    const Søker = () => (
        <Header>
            <Undertekst>{t('oversikt.søker')}</Undertekst>
        </Header>
    );
    const Opprettet = () => (
        <Header>
            <Undertekst role={'columnheader'}>{t('oversikt.opprettet')}</Undertekst>
        </Header>
    );
    const Tildeling = () => (
        <Header>
            <Undertekst>{t('oversikt.tildeling')}</Undertekst>
        </Header>
    );
    const Status = () => (
        <Header>
            <Sorteringsknapp onClick={toggleSortDirection}>
                <Undertekst>Status</Undertekst>
                <Sorteringspiler direction={sortDirection === descending ? 'descending' : 'ascending'} />
            </Sorteringsknapp>
        </Header>
    );

    return (
        <>
            {tildelingError && <Varsel type={Varseltype.Advarsel}>{tildelingError}</Varsel>}
            {(isFetchingBehov || !harAlleTildelinger) && (
                <Varsel type={Varseltype.Info}>
                    Henter personer
                    <NavFrontendSpinner type="XS" />
                </Varsel>
            )}
            <Container border>
                <Undertittel>{t('oversikt.tittel')}</Undertittel>
                <Tabell>
                    <thead>
                        <Row>
                            <Søker />
                            <Opprettet />
                            <Tildeling />
                            <Status />
                        </Row>
                    </thead>
                    <tbody>
                        {harAlleTildelinger &&
                            behov.sort(sortDirection).map((oppgave: Oppgave) => {
                                const tildeling = tildelinger.find((t) => t.behovId === oppgave.spleisbehovId);
                                return (
                                    <Oversiktslinje
                                        oppgave={oppgave}
                                        tildeling={tildeling}
                                        onAssignCase={tildelBehandling}
                                        onUnassignCase={fjernTildeling}
                                        key={oppgave.spleisbehovId}
                                        antallVarsler={oppgave.antallVarsler}
                                    />
                                );
                            })}
                    </tbody>
                </Tabell>
            </Container>
        </>
    );
};

export default Oversikt;

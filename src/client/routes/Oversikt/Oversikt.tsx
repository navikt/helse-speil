import React, { useContext, useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Panel from 'nav-frontend-paneler';
import { TildelingerContext } from '../../context/TildelingerContext';
import { BehovContext } from '../../context/BehovContext';
import { Undertekst } from 'nav-frontend-typografi';
import { useTranslation } from 'react-i18next';
import { Oppgave } from '../../../types';
import styled from '@emotion/styled';
import { Header, Row, Tabell } from './Oversikt.styles';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';
import { PersonContext } from '../../context/PersonContext';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import Oversiktslinje from './Oversiktslinje';
import { Location, useNavigation } from '../../hooks/useNavigation';
import { SuksessToast } from '../../components/Toast';
import { useVarselFilter, Scopes } from '../../state/varslerState';

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
const LasterInnhold = styled.div`
    display: flex;
    align-items: center;
    margin-left: 1rem;
    margin-top: 1rem;
    svg {
        margin-right: 1rem;
        width: 25px;
        height: 25px;
    }
`;

const typetekst = (type: string) => {
    switch (type) {
        case 'FORLENGELSE':
            return 'Forlengelse';
        case 'INFOTRYGDFORLENGELSE':
            return 'Forlengelse - IT';
        case 'FØRSTEGANGSBEHANDLING':
            return 'Førstegang.';
        default:
            return '';
    }
};

const ascending = (a: Oppgave, b: Oppgave) => {
    const sortertPåType = typetekst(a.type).localeCompare(typetekst(b.type));
    if (sortertPåType !== 0) return sortertPåType;
    return a.antallVarsler - b.antallVarsler;
};
const descending = (a: Oppgave, b: Oppgave) => {
    const sortertPåType = typetekst(b.type).localeCompare(typetekst(a.type));
    if (sortertPåType !== 0) return sortertPåType;
    return b.antallVarsler - a.antallVarsler;
};

export const Oversikt = () => {
    const { t } = useTranslation();
    const { navigateTo } = useNavigation();
    const { isFetching: isFetchingPersonBySearch, personTilBehandling, tildelPerson } = useContext(PersonContext);
    const { behov, hentBehov, isFetchingBehov, error: behovContextError } = useContext(BehovContext);
    const { tildelBehandling, tildelinger, tildelingError, fetchTildelinger, fjernTildeling } = useContext(
        TildelingerContext
    );
    useVarselFilter(Scopes.OVERSIKT);
    const [sortDirection, setSortDirection] = useState<(a: Oppgave, b: Oppgave) => number>(() => ascending);
    const harAlleTildelinger = tildelinger.length == behov.length;

    useEffect(() => {
        hentBehov().then((nyeBehov) => fetchTildelinger(nyeBehov));
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

    const onUnassignCase = (behovId: string) => {
        fjernTildeling(behovId);
        if (personTilBehandling) tildelPerson(undefined);
    };

    const onAssignCase = (behovId: string, aktørId: string, email: string) => {
        tildelBehandling(behovId, email)
            .then(() => {
                if (personTilBehandling) tildelPerson(email);
            })
            .then(() => navigateTo(Location.Sykmeldingsperiode, aktørId))
            .catch((_) => {
                fetchTildelinger(behov);
            });
    };

    return (
        <>
            <SuksessToast />
            {tildelingError && <Varsel type={Varseltype.Advarsel}>{tildelingError}</Varsel>}
            {(isFetchingBehov || !harAlleTildelinger) && (
                <LasterInnhold>
                    <NavFrontendSpinner type="XS" />
                    Henter personer
                </LasterInnhold>
            )}
            {isFetchingPersonBySearch && (
                <LasterInnhold>
                    <NavFrontendSpinner type="XS" />
                    Henter person
                </LasterInnhold>
            )}
            {behovContextError && <Varsel type={Varseltype.Feil}>{behovContextError.message}</Varsel>}
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
                                        onAssignCase={onAssignCase}
                                        onUnassignCase={onUnassignCase}
                                        key={oppgave.spleisbehovId}
                                        antallVarsler={oppgave.antallVarsler}
                                        typetekst={typetekst(oppgave.type)}
                                    />
                                );
                            })}
                    </tbody>
                </Tabell>
            </Container>
        </>
    );
};

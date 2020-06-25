import React, { useContext, useEffect } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Panel from 'nav-frontend-paneler';
import { TildelingerContext } from '../../context/TildelingerContext';
import { BehovContext } from '../../context/BehovContext';
import { useTranslation } from 'react-i18next';
import { Oppgave } from '../../../types';
import styled from '@emotion/styled';
import { Row, Tabell } from './Oversikt.styles';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';
import { PersonContext } from '../../context/PersonContext';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import Oversiktslinje from './Oversiktslinje';
import { Location, useNavigation } from '../../hooks/useNavigation';
import { SuksessToast } from '../../components/Toast';
import { Scopes, useVarselFilter } from '../../state/varslerState';
import { OpprettetHeader, SakstypeHeader, StatusHeader, SøkerHeader, TildelingHeader } from './headere/headere';
import { useRecoilState } from 'recoil';
import { aktiveFiltereState, aktivSortering, ascendingOpprettet, descendingOpprettet } from './oversiktState';
import { useLocation } from 'react-router-dom';

const Container = styled(Panel)`
    margin: 1rem;
    padding: 1rem;
    color: #3e3832;
    max-width: max-content;
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

export const Oversikt = () => {
    const { t } = useTranslation();
    const { navigateTo } = useNavigation();
    const { isFetching: isFetchingPersonBySearch, personTilBehandling, tildelPerson } = useContext(PersonContext);
    const { behov, hentBehov, isFetchingBehov, error: behovContextError } = useContext(BehovContext);
    const location = useLocation();
    const { tildelBehandling, tildelinger, tildelingError, fetchTildelinger, fjernTildeling } = useContext(
        TildelingerContext
    );
    const [sortDirection, setSortDirection] = useRecoilState(aktivSortering);
    const [currentFilters, setCurrentFilters] = useRecoilState(aktiveFiltereState);
    const harAlleTildelinger = tildelinger.length == behov.length;

    useVarselFilter(Scopes.OVERSIKT);

    useEffect(() => {
        hentBehov().then((nyeBehov) => fetchTildelinger(nyeBehov));
    }, [location.key]);

    const toggleSortDirection = () =>
        setSortDirection(sortDirection === descendingOpprettet ? () => ascendingOpprettet : () => descendingOpprettet);

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
                            <SøkerHeader />
                            <SakstypeHeader filtere={currentFilters} setFiltere={setCurrentFilters} />
                            <StatusHeader />
                            <OpprettetHeader
                                toggleSort={toggleSortDirection}
                                sortDirection={sortDirection === descendingOpprettet ? 'descending' : 'ascending'}
                            />
                            <TildelingHeader />
                        </Row>
                    </thead>
                    <tbody>
                        {harAlleTildelinger &&
                            behov
                                .filter(
                                    (oppgave: Oppgave) =>
                                        currentFilters.length === 0 || currentFilters.find((it) => it(oppgave))
                                )
                                .sort(sortDirection)
                                .map((oppgave: Oppgave) => {
                                    const tildeling = tildelinger.find((t) => t.behovId === oppgave.spleisbehovId);
                                    return (
                                        <Oversiktslinje
                                            oppgave={oppgave}
                                            tildeling={tildeling}
                                            onAssignCase={onAssignCase}
                                            onUnassignCase={onUnassignCase}
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

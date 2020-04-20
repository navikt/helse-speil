import React, { useCallback, useContext, useEffect, useState } from 'react';
import Oversiktslinje from './Oversiktslinje';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Panel } from 'nav-frontend-paneler';
import { TildelingerContext } from '../../context/TildelingerContext';
import { BehovContext } from '../../context/BehovContext';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import { PersonContext } from '../../context/PersonContext';
import { useInterval } from '../../hooks/useInterval';
import { Person } from '../../context/types';
import { useTranslation } from 'react-i18next';
import { Oppgave } from '../../../types';
import { Location, useNavigation } from '../../hooks/useNavigation';
import dayjs from 'dayjs';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import styled from '@emotion/styled';
import { Header, Row, Tabell } from './Oversikt.styles';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';

const Container = styled(Panel)`
    margin: 1rem;
    padding: 1rem;
`;

const SorterPil = styled.span`
    margin-left: 0.25rem;
    cursor: pointer;
`;

const TWO_MINUTES = 120000;

const ascending = (a: Oppgave, b: Oppgave) => (dayjs(a['oppdatert']).isBefore(b['oppdatert']) ? -1 : 1);
const descending = (a: Oppgave, b: Oppgave) => (dayjs(a['oppdatert']).isBefore(b['oppdatert']) ? 1 : -1);

const Oversikt = () => {
    const { t } = useTranslation();
    const { navigateTo } = useNavigation();
    const { hentPerson } = useContext(PersonContext);
    const { behov, hentBehov, isFetchingBehov } = useContext(BehovContext);
    const { tildelBehandling, tildelinger, tildelingError, fetchTildelinger, fjernTildeling } = useContext(
        TildelingerContext
    );
    const [sortDirection, setSortDirection] = useState<(a: Oppgave, b: Oppgave) => number>(() => ascending);

    useEffect(() => {
        hentBehov();
    }, []);

    const intervalledFetchTildelinger = useCallback(() => fetchTildelinger(behov), [behov]);
    useInterval({ callback: intervalledFetchTildelinger, interval: TWO_MINUTES });

    const velgBehovAndNavigate = (behov: Oppgave) => {
        hentPerson(behov.fødselsnummer).then((person: Person) => {
            navigateTo(Location.Sykmeldingsperiode, person);
        });
    };

    const toggleSortDirection = () =>
        setSortDirection(sortDirection === descending ? () => ascending : () => descending);

    return (
        <>
            {tildelingError && <Varsel type={Varseltype.Advarsel}>{tildelingError}</Varsel>}
            {isFetchingBehov && (
                <Varsel type={Varseltype.Info}>
                    Henter personer
                    <NavFrontendSpinner type="XS" />
                </Varsel>
            )}
            <Container border>
                <Undertittel className="panel-tittel">{t('oversikt.tittel')}</Undertittel>
                <Tabell>
                    <thead>
                        <Row>
                            <Header>
                                <Undertekst>{t('oversikt.søker')}</Undertekst>
                            </Header>
                            <Header>
                                <Undertekst role={'columnheader'}>
                                    {t('oversikt.opprettet')}
                                    <SorterPil onClick={toggleSortDirection}>
                                        {sortDirection === descending ? (
                                            <OppChevron aria-sort="descending" />
                                        ) : (
                                            <NedChevron aria-sort="ascending" />
                                        )}
                                    </SorterPil>
                                </Undertekst>
                            </Header>
                            <Header>
                                <Undertekst>{t('oversikt.tildeling')}</Undertekst>
                            </Header>
                        </Row>
                    </thead>
                    <tbody>
                        {behov.sort(ascending).map((oppgave: Oppgave) => {
                            const tildeling = tildelinger.find(t => t.behovId === oppgave.spleisbehovId);
                            return (
                                <Oversiktslinje
                                    oppgave={oppgave}
                                    tildeling={tildeling}
                                    onAssignCase={tildelBehandling}
                                    onUnassignCase={fjernTildeling}
                                    onSelectCase={velgBehovAndNavigate}
                                    key={oppgave.spleisbehovId}
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

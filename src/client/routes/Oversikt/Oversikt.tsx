import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TildelingerContext } from '../../context/TildelingerContext';
import { BehovContext } from '../../context/BehovContext';
import 'nav-frontend-lenker-style';
import './Oversikt.less';
import { PersonContext } from '../../context/PersonContext';
import { useInterval } from '../../hooks/useInterval';
import { Person } from '../../context/types';
import { useTranslation } from 'react-i18next';
import { Oppgave } from '../../../types';
import { Location, useNavigation } from '../../hooks/useNavigation';
import dayjs from 'dayjs';
import styled from '@emotion/styled';
import Oversiktslinje from './Oversiktslinje';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Panel } from 'nav-frontend-paneler';

const SorterPil = styled.span`
    margin-left: 0.25rem;
    cursor: pointer;
`;

const TWO_MINUTES = 120000;

enum SortDirection {
    DESC,
    ASC
}

const påOpprettetAscending = (a: Oppgave, b: Oppgave) => (dayjs(a['oppdatert']).isBefore(b['oppdatert']) ? -1 : 1);
const påOpprettetDescending = (a: Oppgave, b: Oppgave) => (dayjs(a['oppdatert']).isBefore(b['oppdatert']) ? 1 : -1);

const Oversikt = () => {
    const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.ASC);

    const { navigateTo } = useNavigation();
    const { t } = useTranslation();
    const { hentPerson } = useContext(PersonContext);
    const { behov, hentBehov, isFetchingBehov } = useContext(BehovContext);
    const { tildelBehandling, tildelinger, tildelingError, fetchTildelinger, fjernTildeling } = useContext(
        TildelingerContext
    );

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

    const toggleSortDirection = () => {
        setSortDirection(prevState => (prevState === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC));
    };

    return (
        <div className="Oversikt">
            {tildelingError && <AlertStripeAdvarsel>{tildelingError}</AlertStripeAdvarsel>}
            <div className="Oversikt__container">
                <Panel border className="Oversikt__neste-behandlinger">
                    <Undertittel className="panel-tittel">{t('oversikt.tittel')}</Undertittel>
                    {isFetchingBehov && (
                        <AlertStripeInfo>
                            Henter personer <NavFrontendSpinner type="XS" />
                        </AlertStripeInfo>
                    )}
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <Normaltekst>{t('oversikt.søker')}</Normaltekst>
                                </th>
                                <th>
                                    <Normaltekst role={'columnheader'}>
                                        {t('oversikt.opprettet')}
                                        <SorterPil onClick={toggleSortDirection}>
                                            {sortDirection === SortDirection.ASC ? (
                                                <OppChevron aria-sort="descending" />
                                            ) : (
                                                <NedChevron aria-sort="ascending" />
                                            )}
                                        </SorterPil>
                                    </Normaltekst>
                                </th>
                                <th>
                                    <Normaltekst>{t('oversikt.tildeling')}</Normaltekst>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {behov.sort(påOpprettetAscending).map((behov: Oppgave) => {
                                const tildeling = tildelinger.find(t => t.behovId === behov['@id']);
                                return (
                                    <Oversiktslinje
                                        oppgave={behov}
                                        tildeling={tildeling}
                                        onAssignCase={tildelBehandling}
                                        onUnassignCase={fjernTildeling}
                                        onSelectCase={velgBehovAndNavigate}
                                        key={behov.spleisbehovId}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </Panel>
            </div>
        </div>
    );
};

export default Oversikt;

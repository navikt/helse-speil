import React, { useCallback, useContext, useEffect, useState } from 'react';
import Oversiktslinje from './Oversiktslinje';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Panel } from 'nav-frontend-paneler';
import { TildelingerContext } from '../../context/TildelingerContext';
import { SaksoversiktContext } from '../../context/SaksoversiktContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import 'nav-frontend-lenker-style';
import './Oversikt.less';
import { PersonContext } from '../../context/PersonContext';
import { useInterval } from '../../hooks/useInterval';
import { Person } from '../../context/types';
import { useTranslation } from 'react-i18next';
import { Behov } from '../../../types';
import { Location, useNavigation } from '../../hooks/useNavigation';
import dayjs from 'dayjs';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import styled from '@emotion/styled';

const SorterPil = styled.span`
    margin-left: 0.25rem;
    cursor: pointer;
`;

const TWO_MINUTES = 120000;

enum SortDirection {
    DESC,
    ASC
}

const Oversikt = () => {
    const [behovsliste, setBehovsliste] = useState<Behov[]>([]);
    const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.ASC);

    const { navigateTo } = useNavigation();
    const { t } = useTranslation();
    const { hentPerson } = useContext(PersonContext);
    const { behovoversikt, hentBehovoversikt, isFetchingBehovoversikt, isFetchingPersoninfo } = useContext(
        SaksoversiktContext
    );
    const { tildelBehandling, tildelinger, tildelingError, fetchTildelinger, fjernTildeling } = useContext(
        TildelingerContext
    );

    useEffect(() => {
        if (behovoversikt !== undefined) {
            setBehovsliste(sorter(behovoversikt).reverse());
        }
    }, [behovoversikt]);

    useEffect(() => {
        hentBehovoversikt();
    }, []);

    useEffect(() => {
        setBehovsliste(prevState => [...prevState].reverse());
    }, [sortDirection]);

    const intervalledFetchTildelinger = useCallback(() => fetchTildelinger(behovoversikt), [behovoversikt]);
    useInterval({ callback: intervalledFetchTildelinger, interval: TWO_MINUTES });

    const velgBehovAndNavigate = (behov: Behov) => {
        hentPerson(behov.aktørId).then((person: Person) => {
            navigateTo(Location.Sykmeldingsperiode, person);
        });
    };

    const sorter = (liste: Behov[]) => {
        return [...liste].sort((a, b) => (dayjs(a['@opprettet']).isBefore(b['@opprettet']) ? -1 : 1));
    };

    const sorterBehov = () => {
        setSortDirection(prevState => (prevState === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC));
    };

    return (
        <div className="Oversikt">
            {tildelingError && <AlertStripeAdvarsel>{tildelingError}</AlertStripeAdvarsel>}
            <div className="Oversikt__container">
                <Panel border className="Oversikt__neste-behandlinger">
                    <Undertittel className="panel-tittel">{t('oversikt.tittel')}</Undertittel>
                    {isFetchingBehovoversikt && (
                        <AlertStripeInfo>
                            Henter personer <NavFrontendSpinner type="XS" />
                        </AlertStripeInfo>
                    )}
                    {isFetchingPersoninfo && (
                        <AlertStripeInfo>
                            Henter navn <NavFrontendSpinner type="XS" />
                        </AlertStripeInfo>
                    )}
                    <ul>
                        <li className="row">
                            <Normaltekst>{t('oversikt.søker')}</Normaltekst>
                            <Normaltekst role={'columnheader'}>
                                {t('oversikt.opprettet')}
                                <SorterPil onClick={sorterBehov}>
                                    {sortDirection === SortDirection.ASC ? (
                                        <OppChevron aria-sort="descending" />
                                    ) : (
                                        <NedChevron aria-sort="ascending" />
                                    )}
                                </SorterPil>
                            </Normaltekst>
                            <Normaltekst>{t('oversikt.tildeling')}</Normaltekst>
                        </li>
                        {behovsliste.map((behov: Behov) => {
                            const tildeling = tildelinger.find(t => t.behovId === behov['@id']);
                            return (
                                <Oversiktslinje
                                    behov={behov}
                                    tildeling={tildeling}
                                    onAssignCase={tildelBehandling}
                                    onUnassignCase={fjernTildeling}
                                    onSelectCase={velgBehovAndNavigate}
                                    key={behov['@id']}
                                />
                            );
                        })}
                    </ul>
                </Panel>
            </div>
        </div>
    );
};

export default Oversikt;

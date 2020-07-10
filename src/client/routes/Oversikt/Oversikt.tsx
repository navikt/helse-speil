import React, { useContext, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Panel from 'nav-frontend-paneler';
import { TildelingerContext } from '../../context/TildelingerContext';
import { OppgaverContext } from '../../context/OppgaverContext';
import { useTranslation } from 'react-i18next';
import { Oppgave } from '../../../types';
import styled from '@emotion/styled';
import { Row, Tabell } from './Oversikt.styles';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';
import { PersonContext } from '../../context/PersonContext';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import Oversiktslinje from './Oversiktslinje';
import { SuksessToast } from '../../components/Toast';
import { Scopes, useVarselFilter } from '../../state/varslerState';
import {
    BokommuneHeader,
    OpprettetHeader,
    SakstypeHeader,
    StatusHeader,
    SøkerHeader,
    TildelingHeader,
} from './headere/headere';
import { aktiveFiltereState, aktivKolonneState, aktivSorteringState, sorteringsretningState } from './oversiktState';
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

const useSettInitiellRetning = () => {
    const aktivKolonne = useRecoilValue(aktivKolonneState);
    const setSorteringsretning = useSetRecoilState(sorteringsretningState);

    useEffect(() => {
        setSorteringsretning(aktivKolonne.initiellRetning);
    }, [aktivKolonne]);
};

export const Oversikt = () => {
    const { t } = useTranslation();
    const { isFetching: isFetchingPersonBySearch } = useContext(PersonContext);
    const { oppgaver, hentOppgaver, isFetchingOppgaver, error: oppgaverContextError } = useContext(OppgaverContext);
    const location = useLocation();
    const aktivSortering = useRecoilValue(aktivSorteringState);
    useSettInitiellRetning();
    const [currentFilters, setCurrentFilters] = useRecoilState(aktiveFiltereState);

    useVarselFilter(Scopes.OVERSIKT);

    useEffect(() => {
        hentOppgaver();
    }, [location.key]);

    return (
        <>
            <SuksessToast />
            {isFetchingOppgaver && (
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
            {oppgaverContextError && <Varsel type={Varseltype.Feil}>{oppgaverContextError.message}</Varsel>}
            <Container border>
                <Undertittel>{t('oversikt.tittel')}</Undertittel>
                <Tabell>
                    <thead>
                        <Row>
                            <SøkerHeader />
                            <SakstypeHeader filtere={currentFilters} setFiltere={setCurrentFilters} />
                            <StatusHeader />
                            <BokommuneHeader />
                            <OpprettetHeader />
                            <TildelingHeader />
                        </Row>
                    </thead>
                    <tbody>
                        {oppgaver
                            .filter(
                                (oppgave: Oppgave) =>
                                    currentFilters.length === 0 || currentFilters.find((it) => it(oppgave))
                            )
                            .sort(aktivSortering)
                            .map((oppgave: Oppgave) => {
                                return (
                                    <Oversiktslinje
                                        oppgave={oppgave}
                                        key={oppgave.oppgavereferanse}
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

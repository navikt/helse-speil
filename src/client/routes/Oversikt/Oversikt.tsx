import React, { useContext, useEffect } from 'react';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';
import styled from '@emotion/styled';
import Panel from 'nav-frontend-paneler';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { useLocation } from 'react-router-dom';
import { PersonContext } from '../../context/PersonContext';
import { OppgaverContext } from '../../context/OppgaverContext';
import { Scopes, useVarselFilter } from '../../state/varslerState';
import { VedtaksstatusToast } from './VedtaksstatusToast';
import { OppgaverTabell } from './OppgaverTabell';
import { useEmail } from '../../state/authentication';
import { Oppgave } from '../../../types';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Tabs, tabState } from './tabs';

const Container = styled(Panel)`
    margin: 1rem;
    padding: 1rem;
    color: #3e3832;
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
    const email = useEmail();
    const location = useLocation();
    const { isFetching: isFetchingPersonBySearch } = useContext(PersonContext);
    const { oppgaver, hentOppgaver, isFetchingOppgaver, error: oppgaverContextError } = useContext(OppgaverContext);
    const aktivTab = useRecoilValue(tabState);

    const erTildeltInnloggetBruker = (oppgave: Oppgave) => email === oppgave.tildeltTil;

    useVarselFilter(Scopes.OVERSIKT);

    useEffect(() => {
        hentOppgaver();
    }, [location.key]);

    return (
        <>
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
            <Container>
                <Tabs />
                <OppgaverTabell oppgaver={aktivTab === 'alle' ? oppgaver : oppgaver.filter(erTildeltInnloggetBruker)} />
            </Container>
            <VedtaksstatusToast />
        </>
    );
};

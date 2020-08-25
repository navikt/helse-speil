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
import { useRecoilValue } from 'recoil';
import { Tabs, tabState } from './tabs';
import { Toast } from '../../components/toast';

const Container = styled(Panel)`
    margin: 1rem;
    padding: 1rem;
    color: #3e3832;
`;

const Spinner = styled(NavFrontendSpinner)`
    margin-left: 1rem;
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
            <Toast isShowing={isFetchingOppgaver}>
                Henter oppgaver
                <Spinner type="XS" />
            </Toast>
            <Toast isShowing={isFetchingPersonBySearch}>
                Henter person
                <Spinner type="XS" />
            </Toast>
            {oppgaverContextError && <Varsel type={Varseltype.Feil}>{oppgaverContextError.message}</Varsel>}
            <Container>
                <Tabs />
                {oppgaver.length > 0 && (
                    <OppgaverTabell
                        oppgaver={aktivTab === 'alle' ? oppgaver : oppgaver.filter(erTildeltInnloggetBruker)}
                    />
                )}
            </Container>
            <VedtaksstatusToast />
        </>
    );
};

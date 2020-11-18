import React, { useContext, useEffect } from 'react';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import styled from '@emotion/styled';
import Panel from 'nav-frontend-paneler';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { useLocation } from 'react-router-dom';
import { OppgaverContext } from '../../context/OppgaverContext';
import { Scopes, useVarselFilter } from '../../state/varslerState';
import { OppgaverTabell } from './OppgaverTabell';
import { useEmail } from '../../state/authentication';
import { useRecoilValue } from 'recoil';
import { Tabs, tabState } from './tabs';
import { Toast } from '../../components/toasts/Toast';
import { VedtaksstatusBanner } from '../../components/VedtaksstatusBanner';
import { useDebounce } from '../../hooks/useDebounce';

const Container = styled.div`
    position: relative;
    overflow: hidden;
    flex: 1;
`;

const Content = styled(Panel)`
    margin: 1rem;
    padding: 1rem;
    color: #3e3832;
    overflow: auto;
    height: 100%;
    box-sizing: border-box;
`;

const Spinner = styled(NavFrontendSpinner)`
    margin-left: 1rem;
`;

const useFiltrerteOppgaver = () => {
    const email = useEmail();
    const aktivTab = useRecoilValue(tabState);
    const { oppgaver } = useContext(OppgaverContext);

    return aktivTab === 'alle' ? oppgaver : oppgaver.filter((oppgave) => email === oppgave.tildeltTil);
};

export const Oversikt = () => {
    const location = useLocation();
    const oppgaver = useFiltrerteOppgaver();
    const { hentOppgaver, isFetchingOppgaver, error: oppgaverContextError } = useContext(OppgaverContext);
    const showToast = useDebounce(isFetchingOppgaver);

    useVarselFilter(Scopes.OVERSIKT);

    useEffect(() => {
        hentOppgaver();
    }, [location.key]);

    return (
        <Container>
            <VedtaksstatusBanner />
            <Toast isShowing={showToast}>
                Henter oppgaver
                <Spinner type="XS" />
            </Toast>
            {oppgaverContextError && <Varsel type={Varseltype.Feil}>{oppgaverContextError.message}</Varsel>}
            <Content>
                <Tabs />
                <OppgaverTabell oppgaver={oppgaver} />
            </Content>
        </Container>
    );
};

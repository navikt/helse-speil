import React, { useEffect } from 'react';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import styled from '@emotion/styled';
import Panel from 'nav-frontend-paneler';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { useLocation } from 'react-router-dom';
import { Scopes, useVarselFilter } from '../../state/varslerState';
import { OppgaverTabell } from './OppgaverTabell';
import { Tabs, tabState } from './tabs';
import { Toast } from '../../components/toasts/Toast';
import { VedtaksstatusBanner } from '../../components/VedtaksstatusBanner';
import { useDebounce } from '../../hooks/useDebounce';
import { oppgaverState, useRefetchOppgaver } from '../../state/oppgaver';
import { useEmail } from '../../state/authentication';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { Oppgave } from '../../../types';

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
    const oppgaver = useRecoilValueLoadable(oppgaverState);

    return {
        state: oppgaver.state,
        contents:
            oppgaver.state === 'hasValue'
                ? aktivTab === 'alle'
                    ? oppgaver.contents
                    : oppgaver.contents.filter(({ tildeltTil }) => email)
                : oppgaver.contents,
    };
};

export const Oversikt = () => {
    const location = useLocation();
    const hentOppgaver = useRefetchOppgaver();
    const oppgaver = useFiltrerteOppgaver();
    const showToast = useDebounce(oppgaver.state === 'loading');

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
            {oppgaver.state === 'hasError' && <Varsel type={Varseltype.Feil}>{oppgaver.contents}</Varsel>}
            <Content>
                <Tabs />
                <OppgaverTabell oppgaver={oppgaver.state === 'hasValue' ? (oppgaver.contents as Oppgave[]) : []} />
            </Content>
        </Container>
    );
};

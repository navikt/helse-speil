import React, { useEffect, useState } from 'react';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import styled from '@emotion/styled';
import Panel from 'nav-frontend-paneler';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Scopes, useVarselFilter } from '../../state/varslerState';
import { OppgaverTabell } from './OppgaverTabell';
import { Tabs, tabState } from './tabs';
import { Toast } from '../../components/toasts/Toast';
import { VedtaksstatusBanner } from '../../components/VedtaksstatusBanner';
import { useDebounce } from '../../hooks/useDebounce';
import { oppgaverState, useRefetchOppgaver } from '../../state/oppgaver';
import { useEmail } from '../../state/authentication';
import { useRecoilValue, useRecoilValueLoadable, useResetRecoilState } from 'recoil';
import { Oppgave } from '../../../types';
import { personState } from '../../state/person';

const Container = styled.div`
    position: relative;
    overflow: hidden;
    flex: 1;
`;

const Content = styled(Panel)`
    margin: 1rem;
    padding: 1rem;
    color: var(--navds-color-text-primary);
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
    const [cache, setCache] = useState<Oppgave[]>([]);

    const filtrer = (oppgaver: Oppgave[]): Oppgave[] =>
        aktivTab === 'alle' ? oppgaver : oppgaver.filter(({ tildeltTil }) => tildeltTil === email);

    useEffect(() => {
        if (oppgaver.state === 'hasValue') {
            setCache(filtrer(oppgaver.contents));
        }
    }, [oppgaver.state]);

    return {
        state: oppgaver.state,
        contents: oppgaver.state === 'hasValue' ? filtrer(oppgaver.contents) : oppgaver.contents,
        cache: cache,
    };
};

export const Oversikt = () => {
    const hentOppgaver = useRefetchOppgaver();
    const oppgaver = useFiltrerteOppgaver();
    const showToast = useDebounce(oppgaver.state === 'loading');
    const resetPerson = useResetRecoilState(personState);

    useVarselFilter(Scopes.OVERSIKT);

    useEffect(() => {
        resetPerson();
        if (oppgaver.state !== 'loading') {
            hentOppgaver();
        }
    }, []);

    return (
        <Container>
            <VedtaksstatusBanner />
            <Toast isShowing={showToast}>
                Henter oppgaver
                <Spinner type="XS" />
            </Toast>
            {oppgaver.state === 'hasError' && (
                <Varsel type={Varseltype.Advarsel}>{(oppgaver.contents as Error).message}</Varsel>
            )}
            <Content>
                <Tabs />
                <OppgaverTabell
                    oppgaver={oppgaver.state === 'hasValue' ? (oppgaver.contents as Oppgave[]) : oppgaver.cache}
                />
            </Content>
        </Container>
    );
};

export default Oversikt;

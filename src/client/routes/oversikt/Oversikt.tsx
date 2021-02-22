import React, { useEffect, useState } from 'react';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import styled from '@emotion/styled';
import Panel from 'nav-frontend-paneler';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Scopes, useVarselFilter } from '../../state/varsler';
import { OppgaverTabell } from './OppgaverTabell';
import { Tabs, tabState } from './tabs';
import { useDebounce } from '../../hooks/useDebounce';
import { oppgaverState, useRefetchOppgaver } from '../../state/oppgaver';
import { useEmail } from '../../state/authentication';
import { useRecoilValue, useRecoilValueLoadable, useResetRecoilState } from 'recoil';
import { Oppgave } from '../../../types';
import { personState, useAnonymiserPerson } from '../../state/person';
import { useAddToast, useRemoveToast } from '../../state/toasts';
import { nanoid } from 'nanoid';
import { nullstillAgurkData } from '../../agurkdata';

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
    const setAnonymisering = useAnonymiserPerson();
    const [cache, setCache] = useState<Oppgave[]>([]);
    setAnonymisering(false);
    nullstillAgurkData();

    const filtrer = (oppgaver: Oppgave[]): Oppgave[] =>
        aktivTab === 'alle'
            ? oppgaver
            : aktivTab === 'ventende'
            ? oppgaver.filter(({ tildeltTil, erPåVent }) => tildeltTil === email && erPåVent)
            : oppgaver.filter(({ tildeltTil, erPåVent }) => tildeltTil === email && !erPåVent);

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

const useHenterOppgaverToast = (isLoading: boolean) => {
    const showToast = useDebounce(isLoading);
    const addToast = useAddToast();
    const removeToast = useRemoveToast();

    useEffect(() => {
        const key = nanoid();
        if (showToast) {
            addToast({
                key: key,
                message: (
                    <>
                        Henter oppgaver <Spinner type="XS" />
                    </>
                ),
            });
        } else {
            removeToast(key);
        }
        return () => removeToast(key);
    }, [showToast]);
};

export const Oversikt = () => {
    const hentOppgaver = useRefetchOppgaver();
    const oppgaver = useFiltrerteOppgaver();
    const resetPerson = useResetRecoilState(personState);

    useHenterOppgaverToast(oppgaver.state === 'loading');

    useVarselFilter(Scopes.OVERSIKT);

    useEffect(() => {
        resetPerson();
        if (oppgaver.state !== 'loading') {
            hentOppgaver();
        }
    }, []);

    return (
        <Container>
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

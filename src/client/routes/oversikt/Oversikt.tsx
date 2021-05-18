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
import { useInnloggetSaksbehandler } from '../../state/authentication';
import { useRecoilValue, useRecoilValueLoadable, useResetRecoilState } from 'recoil';
import { personState } from '../../state/person';
import { useAddToast, useRemoveToast } from '../../state/toasts';
import { nanoid } from 'nanoid';
import { nullstillAgurkData } from '../../agurkdata';
import { Oppgave } from 'internal-types';
import { Flex } from '../../components/Flex';
import { Behandlingsstatistikk } from './behandlingsstatistikk/Behandlingsstatistikk';

const Container = styled.div`
    position: relative;
    flex: 1;
    overflow-x: hidden;
`;

const Content = styled(Panel)`
    margin: 1.5rem;
    padding: 0;
    color: var(--navds-color-text-primary);
    overflow: auto hidden;
    box-sizing: border-box;
    flex: 1;
`;

const Spinner = styled(NavFrontendSpinner)`
    margin-left: 1rem;
`;

const useFiltrerteOppgaver = () => {
    const { oid } = useInnloggetSaksbehandler();
    const aktivTab = useRecoilValue(tabState);
    const oppgaver = useRecoilValueLoadable(oppgaverState);
    const [cache, setCache] = useState<Oppgave[]>([]);
    nullstillAgurkData();

    const filtrer = (oppgaver: Oppgave[]): Oppgave[] =>
        aktivTab === 'alle'
            ? oppgaver
            : aktivTab === 'ventende'
            ? oppgaver.filter(({ tildeling }) => tildeling?.saksbehandler.oid === oid && tildeling?.påVent)
            : oppgaver.filter(({ tildeling }) => tildeling?.saksbehandler.oid === oid && !tildeling?.påVent);

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

    const Strek = styled.div`
        min-height: calc(100vh - 50px);
        width: 1px;
        background-color: var(--navds-color-border);
    `;

    return (
        <Container>
            {oppgaver.state === 'hasError' && (
                <Varsel type={Varseltype.Advarsel}>{(oppgaver.contents as Error).message}</Varsel>
            )}
            <Flex>
                <Content>
                    <Tabs />
                    <OppgaverTabell
                        oppgaver={oppgaver.state === 'hasValue' ? (oppgaver.contents as Oppgave[]) : oppgaver.cache}
                    />
                </Content>
                <Strek />
                <Behandlingsstatistikk />
            </Flex>
        </Container>
    );
};

export default Oversikt;

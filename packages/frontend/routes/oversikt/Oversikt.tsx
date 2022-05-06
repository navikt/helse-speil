import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { Loadable, useRecoilValue, useRecoilValueLoadable } from 'recoil';

import { Varsel } from '@components/Varsel';
import { Flex, FlexColumn } from '@components/Flex';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { useResetPerson } from '@state/person';
import { Scopes, useVarselFilter } from '@state/varsler';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { oppgaverState, useRefetchOppgaver } from '@state/oppgaver';

import { IngenOppgaver } from './IngenOppgaver';
import { OppgaverTable } from './table/OppgaverTable';
import { Behandlingsstatistikk } from './behandlingsstatistikk/Behandlingsstatistikk';
import { Tabs, tabState, TabType } from './tabs';

const Container = styled.div`
    position: relative;
    flex: 1;
    overflow-x: hidden;
`;

const Content = styled.div`
    margin: 1.5rem;
    padding: 0;
    color: var(--navds-semantic-color-text);
    overflow: auto hidden;
    box-sizing: border-box;
    flex: 1;
`;

const useOppgaverFilteredByTab = () => {
    const { oid } = useInnloggetSaksbehandler();
    const aktivTab = useRecoilValue(tabState);
    const oppgaver = useRecoilValueLoadable<Oppgave[]>(oppgaverState);
    const [cache, setCache] = useState<Oppgave[]>([]);

    const filtrer = (oppgaver: Oppgave[]): Oppgave[] =>
        aktivTab === TabType.TilGodkjenning
            ? oppgaver.filter((it) => it.tildeling?.saksbehandler?.oid !== oid)
            : aktivTab === TabType.Ventende
            ? oppgaver.filter(({ tildeling }) => tildeling?.saksbehandler?.oid === oid && tildeling?.påVent)
            : oppgaver.filter(({ tildeling }) => tildeling?.saksbehandler?.oid === oid && !tildeling?.påVent);

    useEffect(() => {
        if (oppgaver.state === 'hasValue') {
            setCache(filtrer(oppgaver.contents));
        }
    }, [oppgaver.state]);

    return {
        state: oppgaver.state,
        contents: oppgaver.state === 'hasValue' ? filtrer(oppgaver.contents) : oppgaver.contents,
        cache: filtrer(cache),
    };
};

const useResetPersonOnMount = (): void => {
    const resetPerson = useResetPerson();

    useEffect(() => {
        resetPerson();
    }, []);
};

const useFetchOppgaver = (currentState: Loadable<Array<Oppgave>>['state']): void => {
    const hentOppgaver = useRefetchOppgaver();

    useEffect(() => {
        if (currentState !== 'loading') {
            hentOppgaver();
        }
    }, []);
};

export const Oversikt = () => {
    const oppgaver = useOppgaverFilteredByTab();

    useLoadingToast({ isLoading: oppgaver.state === 'loading', message: 'Henter oppgaver' });
    useVarselFilter(Scopes.OVERSIKT);
    useResetPersonOnMount();
    useFetchOppgaver(oppgaver.state);

    const hasData =
        (oppgaver.state === 'hasValue' && (oppgaver.contents as Oppgave[]).length > 0) || oppgaver.cache.length > 0;

    return (
        <Container>
            {oppgaver.state === 'hasError' && (
                <Varsel variant="advarsel">{(oppgaver.contents as Error).message}</Varsel>
            )}
            <FlexColumn>
                <Tabs />
                <Flex style={{ height: '100%' }}>
                    <Content>
                        {hasData ? (
                            <OppgaverTable
                                oppgaver={
                                    oppgaver.state === 'hasValue' ? (oppgaver.contents as Oppgave[]) : oppgaver.cache
                                }
                            />
                        ) : oppgaver.state !== 'loading' ? (
                            <IngenOppgaver />
                        ) : null}
                    </Content>
                    <Behandlingsstatistikk />
                </Flex>
            </FlexColumn>
        </Container>
    );
};

export default Oversikt;

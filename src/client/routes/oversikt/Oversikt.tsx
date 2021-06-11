import styled from '@emotion/styled';
import { Oppgave } from 'internal-types';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable, useResetRecoilState } from 'recoil';

import Panel from 'nav-frontend-paneler';

import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';

import { Flex, FlexColumn } from '../../components/Flex';
import { useLoadingToast } from '../../hooks/useLoadingToast';
import { useInnloggetSaksbehandler } from '../../state/authentication';
import { oppgaverState, useRefetchOppgaver } from '../../state/oppgaver';
import { personState } from '../../state/person';
import { Scopes, useVarselFilter } from '../../state/varsler';

import { nullstillAgurkData } from '../../agurkdata';
import { IngenOppgaver } from './IngenOppgaver';
import { Behandlingsstatistikk } from './behandlingsstatistikk/Behandlingsstatistikk';
import { OppgaverTable } from './table/OppgaverTable';
import { Tabs, tabState, TabType } from './tabs';

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

const useOppgaverFilteredByTab = () => {
    const { oid } = useInnloggetSaksbehandler();
    const aktivTab = useRecoilValue(tabState);
    const oppgaver = useRecoilValueLoadable<Oppgave[]>(oppgaverState);
    const [cache, setCache] = useState<Oppgave[]>([]);
    nullstillAgurkData();

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

export const Oversikt = () => {
    const hentOppgaver = useRefetchOppgaver();
    const oppgaver = useOppgaverFilteredByTab();
    const resetPerson = useResetRecoilState(personState);

    useLoadingToast({ isLoading: oppgaver.state === 'loading', message: 'Henter oppgaver' });

    useVarselFilter(Scopes.OVERSIKT);

    useEffect(() => {
        resetPerson();
        if (oppgaver.state !== 'loading') {
            hentOppgaver();
        }
    }, []);

    const hasData =
        (oppgaver.state === 'hasValue' && (oppgaver.contents as Oppgave[]).length > 0) || oppgaver.cache.length > 0;

    return (
        <Container>
            {oppgaver.state === 'hasError' && (
                <Varsel type={Varseltype.Advarsel}>{(oppgaver.contents as Error).message}</Varsel>
            )}
            <FlexColumn style={{ height: '100%' }}>
                <Tabs />
                <Flex style={{ height: '100%' }}>
                    <Content>
                        {hasData ? (
                            <OppgaverTable
                                oppgaver={
                                    oppgaver.state === 'hasValue' ? (oppgaver.contents as Oppgave[]) : oppgaver.cache
                                }
                            />
                        ) : (
                            <IngenOppgaver />
                        )}
                    </Content>
                    <Behandlingsstatistikk />
                </Flex>
            </FlexColumn>
        </Container>
    );
};

export default Oversikt;

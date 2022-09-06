import React, { useEffect, useState } from 'react';
import { Loadable, useRecoilValue, useRecoilValueLoadable } from 'recoil';

import { Varsel } from '@components/Varsel';
import { Flex } from '@components/Flex';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { useResetPerson } from '@state/person';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { oppgaverState, useRefetchOppgaver } from '@state/oppgaver';

import { IngenOppgaver } from './IngenOppgaver';
import { OppgaverTable } from './table/OppgaverTable';
import { BehandlingsstatistikkView } from './behandlingsstatistikk/BehandlingsstatistikkView';
import { Tabs, tabState, TabType } from './Tabs';

import styles from './Oversikt.module.css';

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

    useResetPersonOnMount();
    useFetchOppgaver(oppgaver.state);

    const hasData =
        (oppgaver.state === 'hasValue' && (oppgaver.contents as Oppgave[]).length > 0) || oppgaver.cache.length > 0;

    return (
        <div className={styles.Oversikt}>
            {oppgaver.state === 'hasError' && <Varsel variant="warning">{(oppgaver.contents as Error).message}</Varsel>}
            <Tabs />
            <Flex className={styles.fullHeight}>
                <div className={styles.Content}>
                    {hasData ? (
                        <OppgaverTable
                            oppgaver={oppgaver.state === 'hasValue' ? (oppgaver.contents as Oppgave[]) : oppgaver.cache}
                        />
                    ) : oppgaver.state !== 'loading' ? (
                        <IngenOppgaver />
                    ) : null}
                </div>
                <BehandlingsstatistikkView />
            </Flex>
        </div>
    );
};

export default Oversikt;

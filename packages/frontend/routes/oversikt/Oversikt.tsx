import React, { useEffect, useState } from 'react';
import { Loadable, useRecoilValue, useRecoilValueLoadable } from 'recoil';

import { Flex } from '@components/Flex';
import { Varsel } from '@components/Varsel';
import { useResetPerson } from '@state/person';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { oppgaverState, useRefetchFerdigstilteOppgaver, useRefetchOppgaver } from '@state/oppgaver';
import { erBehandletIdagEnabled } from '@utils/featureToggles';
import { useLoadingToast } from '@hooks/useLoadingToast';

import { IngenOppgaver } from './IngenOppgaver';
import { OppgaverTable } from './table/OppgaverTable';
import { BehandletIdagTable } from './table/BehandletIdagTable';
import { BehandlingsstatistikkView } from './behandlingsstatistikk/BehandlingsstatistikkView';
import { Tabs, tabState, TabType, useAktivTab } from './Tabs';

import styles from './Oversikt.module.css';

const useOppgaverFilteredByTab = () => {
    const { oid } = useInnloggetSaksbehandler();
    const aktivTab = useRecoilValue(tabState);
    const oppgaver = useRecoilValueLoadable<Oppgave[]>(oppgaverState);
    const [cache, setCache] = useState<Oppgave[]>([]);

    const filtrer = (oppgaver: Oppgave[]): Oppgave[] => {
        switch (aktivTab) {
            case TabType.TilGodkjenning: {
                return oppgaver.filter((it) => it.tildeling?.saksbehandler?.oid !== oid);
            }
            case TabType.Mine: {
                return oppgaver.filter(({ tildeling }) => tildeling?.saksbehandler?.oid === oid && !tildeling?.påVent);
            }
            case TabType.Ventende: {
                return oppgaver.filter(({ tildeling }) => tildeling?.saksbehandler?.oid === oid && tildeling?.påVent);
            }
            case TabType.BehandletIdag: {
                return [];
            }
        }
    };

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
    const fetchFerdigstilteOppgaver = useRefetchFerdigstilteOppgaver();

    useEffect(() => {
        if (currentState !== 'loading') {
            fetchFerdigstilteOppgaver();
            hentOppgaver();
        }
    }, []);
};

export const Oversikt = () => {
    const oppgaver = useOppgaverFilteredByTab();
    const aktivTab = useAktivTab();

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
                    {aktivTab === TabType.BehandletIdag && erBehandletIdagEnabled ? (
                        <BehandletIdagTable />
                    ) : hasData ? (
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

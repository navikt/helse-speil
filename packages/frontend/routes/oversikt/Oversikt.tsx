import React, { useEffect, useState } from 'react';
import { Loadable } from 'recoil';

import { Alert } from '@navikt/ds-react';

import { ApolloError } from '@apollo/client';
import { Flex } from '@components/Flex';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { FerdigstiltOppgave, FetchOppgaverQuery } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useFerdigstilteOppgaver, useQueryOppgaver, useRefetchFerdigstilteOppgaver } from '@state/oppgaver';
import { useResetPerson } from '@state/person';

import { IngenOppgaver } from './IngenOppgaver';
import { Tabs } from './Tabs';
import { BehandlingsstatistikkView } from './behandlingsstatistikk/BehandlingsstatistikkView';
import { TabType, useAktivTab } from './tabState';
import { BehandletIdagTable } from './table/BehandletIdagTable';
import { OppgaverTable } from './table/OppgaverTable/OppgaverTable';
import { OppgaverTableSkeleton } from './table/OppgaverTableSkeleton';

import styles from './Oversikt.module.css';

type Oppgaver = FetchOppgaverQuery['alleOppgaver'];

interface FilteredOppgaverResponse {
    state: 'hasError' | 'loading' | 'hasValue';
    error?: ApolloError;
    contents: Oppgaver;
    cache: Oppgaver;
}

const useOppgaverFilteredByTab = (): FilteredOppgaverResponse => {
    const { oid } = useInnloggetSaksbehandler();
    const aktivTab = useAktivTab();
    const oppgaverResponse = useQueryOppgaver();
    const [cache, setCache] = useState<Oppgaver>(oppgaverResponse.oppgaver ?? []);

    const filtrer = (oppgaver: Oppgaver): Oppgaver => {
        switch (aktivTab) {
            case TabType.TilGodkjenning: {
                return oppgaver.filter((oppgave) =>
                    // @TODO: kanskje markere saker man har sendt til beslutter på annen måte og vise dem, enn å bare fjerne dem fra lista
                    oppgave.totrinnsvurdering?.erBeslutteroppgave
                        ? oppgave.totrinnsvurdering.saksbehandler !== oid
                        : true,
                );
            }
            case TabType.Mine: {
                return oppgaver.filter(({ tildeling }) => tildeling?.oid === oid && !tildeling?.paaVent);
            }
            case TabType.Ventende: {
                return oppgaver.filter(({ tildeling }) => tildeling?.oid === oid && tildeling?.paaVent);
            }
            case TabType.BehandletIdag: {
                return [];
            }
        }
    };

    useEffect(() => {
        if (oppgaverResponse.oppgaver !== undefined) {
            setCache(filtrer(oppgaverResponse.oppgaver));
        }
    }, [oppgaverResponse.loading]);

    const state = oppgaverResponse.error !== undefined ? 'hasError' : oppgaverResponse.loading ? 'loading' : 'hasValue';
    return {
        state: state,
        error: oppgaverResponse.error,
        contents: oppgaverResponse.oppgaver !== undefined ? filtrer(oppgaverResponse.oppgaver) : [],
        cache: filtrer(cache),
    };
};

const useResetPersonOnMount = (): void => {
    const resetPerson = useResetPerson();

    useEffect(() => {
        resetPerson();
    }, []);
};

// Bruker any fordi hooken ikke har noe forhold til innholdet i Loadablen
const useFetchOppgaver = (currentState: Loadable<Array<any>>['state']): void => {
    const hentOppgaver = useQueryOppgaver;

    useEffect(() => {
        if (currentState !== 'loading') {
            hentOppgaver();
        }
    }, []);
};

const useFetchFerdigstilteOppgaver = (currentState: FetchedData<Array<FerdigstiltOppgave>>['state']): void => {
    const fetchFerdigstilteOppgaver = useRefetchFerdigstilteOppgaver();

    useEffect(() => {
        if (currentState !== 'isLoading') {
            fetchFerdigstilteOppgaver();
        }
    }, []);
};

export const Oversikt = () => {
    const oppgaver = useOppgaverFilteredByTab();
    const ferdigstilteOppgaver = useFerdigstilteOppgaver();
    const aktivTab = useAktivTab();

    useLoadingToast({ isLoading: oppgaver.state === 'loading', message: 'Henter oppgaver' });

    useResetPersonOnMount();
    useFetchOppgaver(oppgaver.state);
    useFetchFerdigstilteOppgaver(ferdigstilteOppgaver.state);

    const hasData = (oppgaver.state === 'hasValue' && oppgaver.contents.length > 0) || oppgaver.cache.length > 0;

    return (
        <main className={styles.Oversikt}>
            {oppgaver.state === 'hasError' && (
                <Alert className={styles.Alert} variant="warning" size="small">
                    {oppgaver.error?.message}
                </Alert>
            )}
            <Tabs />
            <Flex className={styles.fullHeight}>
                <section className={styles.Content}>
                    {aktivTab === TabType.BehandletIdag ? (
                        <BehandletIdagTable />
                    ) : hasData ? (
                        <OppgaverTable
                            oppgaver={oppgaver.state === 'hasValue' ? (oppgaver.contents as Oppgaver) : oppgaver.cache}
                        />
                    ) : oppgaver.state === 'loading' ? (
                        <OppgaverTableSkeleton />
                    ) : (
                        <IngenOppgaver />
                    )}
                </section>
                <BehandlingsstatistikkView />
            </Flex>
        </main>
    );
};

export default Oversikt;

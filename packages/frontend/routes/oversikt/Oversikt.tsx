import React, { useEffect } from 'react';

import { Alert } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { FetchOppgaverQuery } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { OppgaverResponse, useQueryOppgaver } from '@state/oppgaver';
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
const useOppgaverFilteredByTab = (): OppgaverResponse => {
    const { oid } = useInnloggetSaksbehandler();
    const aktivTab = useAktivTab();
    const oppgaverResponse = useQueryOppgaver();

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

    return {
        ...oppgaverResponse,
        oppgaver: oppgaverResponse.oppgaver ? filtrer(oppgaverResponse.oppgaver) : oppgaverResponse.oppgaver,
    };
};

const useResetPersonOnMount = (): void => {
    const resetPerson = useResetPerson();

    useEffect(() => {
        resetPerson();
    }, []);
};

export const Oversikt = () => {
    const oppgaverResponse = useOppgaverFilteredByTab();
    const aktivTab = useAktivTab();

    useLoadingToast({ isLoading: oppgaverResponse.loading, message: 'Henter oppgaver' });

    useResetPersonOnMount();

    return (
        <main className={styles.Oversikt}>
            {oppgaverResponse.error && (
                <Alert className={styles.Alert} variant="warning" size="small">
                    {oppgaverResponse.error?.message}
                </Alert>
            )}
            <Tabs />
            <Flex className={styles.fullHeight}>
                <section className={styles.Content}>
                    {aktivTab === TabType.BehandletIdag ? (
                        <BehandletIdagTable />
                    ) : oppgaverResponse.loading ? (
                        <OppgaverTableSkeleton />
                    ) : oppgaverResponse.oppgaver && oppgaverResponse.oppgaver?.length > 0 ? (
                        <OppgaverTable oppgaver={oppgaverResponse.oppgaver} />
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

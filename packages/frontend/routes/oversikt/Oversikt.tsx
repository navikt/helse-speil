import React, { Suspense, lazy } from 'react';

import { Alert } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { useQueryAlleOppgaver } from '@state/oppgaver';
import { onLazyLoadFail } from '@utils/error';

import { IngenOppgaver } from './IngenOppgaver';
import { Tabs } from './Tabs';
import { BehandlingsstatistikkView } from './behandlingsstatistikk/BehandlingsstatistikkView';
import { TabType, useAktivTab } from './tabState';
import { OppgaverTable } from './table/OppgaverTable/OppgaverTable';
import { OppgaverTableSkeleton } from './table/OppgaverTableSkeleton';

import styles from './Oversikt.module.css';

const BehandletIdagTable = lazy(() =>
    import('./table/BehandletIdagTable.js').then((res) => ({ default: res.BehandletIdagTable })).catch(onLazyLoadFail),
);

export const Oversikt = () => {
    const oppgaverResponse = useQueryAlleOppgaver();
    const aktivTab = useAktivTab();

    useLoadingToast({ isLoading: oppgaverResponse.loading, message: 'Henter oppgaver' });

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
                        <Suspense fallback={<OppgaverTableSkeleton />}>
                            <BehandletIdagTable />
                        </Suspense>
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

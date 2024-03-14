import React, { Suspense, lazy } from 'react';

import { Alert } from '@navikt/ds-react';

import { EmojiTilbakemelding } from '@components/flexjar/EmojiTilbamelding';
import { Widget } from '@components/flexjar/Widget';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { useOppgaveFeed } from '@state/oppgaver';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onLazyLoadFail } from '@utils/error';
import { flexjar } from '@utils/featureToggles';

import { IngenOppgaver } from './IngenOppgaver';
import { Tabs } from './Tabs';
import { BehandlingsstatistikkView } from './behandlingsstatistikk/BehandlingsstatistikkView';
import { Filtermeny } from './filtermeny/Filtermeny';
import { TabType, useAktivTab } from './tabState';
import { OppgaverTable } from './table/OppgaverTable/OppgaverTable';
import { OppgaverTableSkeleton } from './table/OppgaverTableSkeleton';
import { useFilters } from './table/state/filter';

import styles from './Oversikt.module.css';

const BehandletIdagTable = lazy(() =>
    import('./table/BehandletIdagTable.js').then((res) => ({ default: res.BehandletIdagTable })).catch(onLazyLoadFail),
);

export const Oversikt = () => {
    const oppgaveFeed = useOppgaveFeed();
    const aktivTab = useAktivTab();
    const { allFilters } = useFilters();
    const queryClient = new QueryClient();

    useLoadingToast({ isLoading: oppgaveFeed.loading, message: 'Henter oppgaver' });

    return (
        <main className={styles.Oversikt}>
            {oppgaveFeed.error && (
                <Alert className={styles.Alert} variant="warning" size="small">
                    {oppgaveFeed.error?.message}
                </Alert>
            )}
            <Tabs />
            <div className={styles.fullHeight}>
                <Filtermeny filters={allFilters} />
                <section className={styles.Content}>
                    {aktivTab === TabType.BehandletIdag ? (
                        <Suspense fallback={<OppgaverTableSkeleton />}>
                            <BehandletIdagTable />
                        </Suspense>
                    ) : oppgaveFeed.loading ? (
                        <OppgaverTableSkeleton />
                    ) : oppgaveFeed.oppgaver ? (
                        <OppgaverTable
                            oppgaver={oppgaveFeed.oppgaver}
                            antallOppgaver={oppgaveFeed.antallOppgaver}
                            numberOfPages={oppgaveFeed.numberOfPages}
                            currentPage={oppgaveFeed.currentPage}
                            limit={oppgaveFeed.limit}
                            setPage={oppgaveFeed.setPage}
                        />
                    ) : (
                        <IngenOppgaver />
                    )}
                </section>
                <BehandlingsstatistikkView />
            </div>
            {flexjar && (
                <QueryClientProvider client={queryClient}>
                    <Widget>
                        <EmojiTilbakemelding
                            feedbackId="speil-generell"
                            tittel="Hjelp oss å gjøre Speil bedre"
                            sporsmal="Hvordan fungerer Speil for deg?"
                            feedbackProps={{
                                erOppgaveOversikt: true,
                            }}
                        />
                    </Widget>
                </QueryClientProvider>
            )}
        </main>
    );
};

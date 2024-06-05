'use client';

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

import { Alert } from '@navikt/ds-react';

import { BehandletIdagTable } from '@/routes/oversikt/table/BehandletIdagTable';
import { EmojiTilbakemelding } from '@components/flexjar/EmojiTilbamelding';
import { Widget } from '@components/flexjar/Widget';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { useOppgaveFeed } from '@state/oppgaver';
import { onLazyLoadFail } from '@utils/error';

import { useKeyboardShortcuts } from '../saksbilde/useKeyboardShortcuts';
import { IngenOppgaver } from './IngenOppgaver';
import { BehandlingsstatistikkView } from './behandlingsstatistikk/BehandlingsstatistikkView';
import { TabType, useAktivTab } from './tabState';
import { OppgaverTable } from './table/OppgaverTable/OppgaverTable';
import { OppgaverTableSkeleton } from './table/OppgaverTableSkeleton';
import { useFilters } from './table/state/filter';

import styles from './Oversikt.module.css';

const Filtermeny = dynamic(
    () => import('./filtermeny/Filtermeny').then((res) => ({ default: res.Filtermeny })).catch(onLazyLoadFail),
    { ssr: false },
);

const Tabs = dynamic(() => import('./Tabs').then((res) => ({ default: res.Tabs })).catch(onLazyLoadFail), {
    ssr: false,
});

export const Oversikt = () => {
    const oppgaveFeed = useOppgaveFeed();
    const aktivTab = useAktivTab();
    const { allFilters } = useFilters();

    useLoadingToast({ isLoading: oppgaveFeed.loading, message: 'Henter oppgaver' });
    useKeyboardShortcuts();

    return (
        <main className={styles.Oversikt}>
            {oppgaveFeed.error && (
                <Alert className={styles.Alert} variant="warning" size="small">
                    {oppgaveFeed.error?.message}
                </Alert>
            )}
            {/*TODO: lage fallback*/}
            <Suspense>
                <Tabs />
            </Suspense>
            <div className={styles.fullHeight}>
                {/*TODO: lage fallback*/}
                <Suspense>
                    <Filtermeny filters={allFilters} />
                </Suspense>
                <section className={styles.Content}>
                    {aktivTab === TabType.BehandletIdag ? (
                        <BehandletIdagTable />
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
        </main>
    );
};

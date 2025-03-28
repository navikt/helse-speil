'use client';

import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { EmojiTilbakemelding } from '@components/flexjar/EmojiTilbamelding';
import { Widget } from '@components/flexjar/Widget';
import { useFjernPersonFraApolloCache } from '@hooks/useFjernPersonFraApolloCache';
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { useRefetchDriftsmeldinger } from '@hooks/useRefetchDriftsmeldinger';
import { BehandlingsstatistikkView } from '@oversikt/behandlingsstatistikk/BehandlingsstatistikkView';
import { FiltermenySkeleton } from '@oversikt/filtermeny/Filtermeny';
import { BehandletIdagTable } from '@oversikt/table/BehandletIdagTable';
import { OppgaverTable } from '@oversikt/table/oppgaverTable/OppgaverTable';
import { useOppgaveFeed } from '@state/oppgaver';

import { IngenOppgaver } from './IngenOppgaver';
import { TabsSkeleton } from './Tabs';
import { TabType, useAktivTab } from './tabState';
import { OppgaverTableSkeleton } from './table/OppgaverTableSkeleton';
import { useFilters } from './table/state/filter';

import styles from './Oversikt.module.css';

const Filtermeny = dynamic(() => import('./filtermeny/Filtermeny').then((mod) => mod.Filtermeny), {
    ssr: false,
    loading: () => <FiltermenySkeleton />,
});

const Tabs = dynamic(() => import('./Tabs').then((mod) => mod.Tabs), {
    ssr: false,
    loading: () => <TabsSkeleton />,
});

export const Oversikt = (): ReactElement => {
    const oppgaveFeed = useOppgaveFeed();
    const aktivTab = useAktivTab();
    const { allFilters } = useFilters();

    // oppgaveFeed.oppgaver blir undefined hvis man velger inn eller ut egenskaper og det blir en request apollo client
    // ikke har gjort ennå
    const harIkkeHentetOppgaverForGjeldendeQuery = oppgaveFeed.oppgaver === undefined && oppgaveFeed.loading;

    useLoadingToast({ isLoading: harIkkeHentetOppgaverForGjeldendeQuery, message: 'Henter oppgaver' });
    useKeyboardShortcuts();
    useFjernPersonFraApolloCache();
    useRefetchDriftsmeldinger();

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
                        <BehandletIdagTable />
                    ) : harIkkeHentetOppgaverForGjeldendeQuery ? (
                        <OppgaverTableSkeleton />
                    ) : oppgaveFeed.oppgaver ? (
                        <OppgaverTable
                            oppgaver={oppgaveFeed.oppgaver}
                            loading={oppgaveFeed.loading}
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

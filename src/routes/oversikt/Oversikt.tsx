'use client';

import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

import { Tilbakemelding } from '@components/flexjar/Tilbakemeldinger';
import { useFjernPersonFraApolloCache } from '@hooks/useFjernPersonFraApolloCache';
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';
import { useRefetchDriftsmeldinger } from '@hooks/useRefetchDriftsmeldinger';
import { BehandlingsstatistikkView } from '@oversikt/behandlingsstatistikk/BehandlingsstatistikkView';
import { FiltermenySkeleton } from '@oversikt/filtermeny/Filtermeny';
import { BehandletIdagTable } from '@oversikt/table/BehandletIdagTable';
import { OppgaverTable } from '@oversikt/table/oppgaverTable/OppgaverTable';
import { useSorteringValue } from '@oversikt/table/state/sortation';
import { useAntallOppgaver } from '@state/oppgaver';

import { TabsSkeleton } from './Tabs';
import { TabType, useAktivTab } from './tabState';
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
    const { antallMineSaker, antallPåVent } = useAntallOppgaver();
    const aktivTab = useAktivTab();
    const { allFilters } = useFilters();
    const sort = useSorteringValue();

    useKeyboardShortcuts();
    useFjernPersonFraApolloCache();
    useRefetchDriftsmeldinger();

    return (
        <main className={styles.Oversikt}>
            <Tabs antallMineSaker={antallMineSaker} antallPåVent={antallPåVent} />
            <div className={styles.fullHeight}>
                <Filtermeny filters={allFilters} />
                <section className={styles.Content}>
                    {aktivTab === TabType.BehandletIdag ? (
                        <BehandletIdagTable />
                    ) : (
                        <OppgaverTable antallMineSaker={antallMineSaker} antallPåVent={antallPåVent} sort={sort} />
                    )}
                </section>
                <BehandlingsstatistikkView />
            </div>
            <Tilbakemelding.ForOversikt />
        </main>
    );
};

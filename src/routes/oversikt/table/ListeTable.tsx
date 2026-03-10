'use client';

import React, { ReactElement } from 'react';

import { Table, VStack } from '@navikt/ds-react';

import { useLoadingToast } from '@hooks/useLoadingToast';
import { BehandletIdagTableSkeleton } from '@oversikt/table/BehandletIdagTableSkeleton';
import { OppgaverTableError } from '@oversikt/table/OppgaverTableError';
import { Pagination } from '@oversikt/table/Pagination';
import { HeaderCell } from '@oversikt/table/oppgaverTable/HeaderCell';
import { IngenMatchendeFiltre } from '@oversikt/table/oppgaverTable/IngenMatchendeFiltre';
import { TilGodkjenningOppgaveRow } from '@oversikt/table/oppgaverTable/tilGodkjenning/TilGodkjenningOppgaveRow';
import { useListeOppgaveFeed } from '@state/listeOppgaver';
import { cn } from '@utils/tw';

export function ListeTable(): ReactElement {
    const { oppgaver, antallOppgaver, error, loading } = useListeOppgaveFeed();
    const harIkkeHentetOppgaverForGjeldendeQuery = oppgaver === undefined && loading;

    useLoadingToast({ isLoading: harIkkeHentetOppgaverForGjeldendeQuery, message: 'Henter oppgaver' });

    if (harIkkeHentetOppgaverForGjeldendeQuery) {
        return <BehandletIdagTableSkeleton />;
    }

    if (error) {
        return <OppgaverTableError />;
    }
    return (
        <VStack className={cn('h-full overflow-auto', loading && '[&_tbody]:opacity-60 [&_tbody]:transition-opacity')}>
            <div className="flex-1 overflow-auto p-0 text-ax-text-neutral [scrollbar-width:none]">
                <div className="m-0 h-[calc(100%-50px)] w-full p-0">
                    <Table aria-label="Oppgaver behandlet av meg i dag" zebraStripes>
                        <Table.Header>
                            <Table.Row>
                                <HeaderCell text="Saksbehandler" />
                                <Table.DataCell rowSpan={2} />
                                <HeaderCell text="Dato" />
                                <Table.DataCell rowSpan={2} aria-label="valg" />
                                <Table.DataCell rowSpan={2} aria-label="notater" />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {oppgaver && oppgaver.length > 0 ? (
                                oppgaver.map((oppgave) => (
                                    <TilGodkjenningOppgaveRow key={oppgave.id} oppgave={oppgave} />
                                ))
                            ) : (
                                <IngenMatchendeFiltre />
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>
            <Pagination antallOppgaver={antallOppgaver} />
        </VStack>
    );
}

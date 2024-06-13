import React from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';
import { SortKey, useUpdateSort } from '@oversikt/table/state/sortation';

import { DateSelectHeader } from '../DateSelectHeader';
import { IngenMatchendeFiltre } from '../IngenMatchendeFiltre';
import { TilGodkjenningOppgaveRow } from './TilGodkjenningOppgaveRow';
import { TilGodkjenningSortHeaderRow } from './TilGodkjenningSortHeaderRow';

import styles from '../../table.module.css';

interface TilGodkjenningTableProps {
    oppgaver: OppgaveTilBehandling[];
    readOnly: boolean;
    sort: SortState | undefined;
    setSort: (state: SortState | undefined) => void;
}

export const TilGodkjenningTable = ({ oppgaver, readOnly, sort, setSort }: TilGodkjenningTableProps) => {
    const updateSort = useUpdateSort();
    return (
        <Table
            sort={sort}
            onSortChange={(sortKey: string | undefined) => sortKey && updateSort(sort, setSort, sortKey as SortKey)}
            className={styles.Table}
            aria-label="Saker som er klare for behandling"
            zebraStripes
        >
            <Table.Header>
                <DateSelectHeader />
                <TilGodkjenningSortHeaderRow />
            </Table.Header>
            <Table.Body>
                {oppgaver.length > 0 ? (
                    oppgaver.map((oppgave) => (
                        <TilGodkjenningOppgaveRow key={oppgave.id} oppgave={oppgave} readOnly={readOnly} />
                    ))
                ) : (
                    <IngenMatchendeFiltre />
                )}
            </Table.Body>
        </Table>
    );
};

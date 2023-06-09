import React, { useState } from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { OppgaveForOversiktsvisning } from '@io/graphql';
import { useSyncNotater } from '@state/notater';

import { Filter } from '../../state/filter';
import { Pagination } from '../../state/pagination';
import { SortKey, defaultSortation, sortRows, updateSort } from '../../state/sortation';
import styles from '../../table.module.css';
import { TilGodkjenningDropdownHeaderRow } from './TilGodkjenningDropdownHeaderRow';
import { TilGodkjenningOppgaveRow } from './TilGodkjenningOppgaveRow';
import { TilGodkjenningSortHeaderRow } from './TilGodkjenningSortHeaderRow';

interface TilGodkjenningTableProps {
    filters: Filter<OppgaveForOversiktsvisning>[];
    filteredRows: OppgaveForOversiktsvisning[];
    pagination: Pagination | null;
    readOnly: boolean;
}

export const TilGodkjenningTable = ({ filters, filteredRows, pagination, readOnly }: TilGodkjenningTableProps) => {
    const [sort, setSort] = useState<SortState | undefined>(defaultSortation);
    console.log(filteredRows);
    console.log(sort);
    const sortedRows = sort ? sortRows(sort, filteredRows) : filteredRows;
    console.log('sortedRows: ', sortedRows);
    const paginatedRows = pagination
        ? sortedRows.slice(pagination.firstVisibleEntry, pagination.lastVisibleEntry + 1)
        : sortedRows;

    const vedtaksperiodeIder = paginatedRows.map((t) => t.vedtaksperiodeId);
    useSyncNotater(vedtaksperiodeIder);

    return (
        <Table
            sort={sort}
            onSortChange={(sortKey: string | undefined) => sortKey && updateSort(sort, setSort, sortKey as SortKey)}
            className={styles.Table}
            aria-label="Saker som er klare for behandling"
            zebraStripes
        >
            <Table.Header>
                <TilGodkjenningDropdownHeaderRow filters={filters} />
                <TilGodkjenningSortHeaderRow />
            </Table.Header>
            <Table.Body>
                {paginatedRows.map((oppgave) => (
                    <TilGodkjenningOppgaveRow key={oppgave.id} oppgave={oppgave} readOnly={readOnly} />
                ))}
            </Table.Body>
        </Table>
    );
};

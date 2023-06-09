import { PåVentDropdownHeaderRow } from './PåVentDropdownHeaderRow';
import { PåVentOppgaveRow } from './PåVentOppgaveRow';
import { PåVentSortHeaderRow } from './PåVentSortHeaderRow';
import React, { useState } from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { OppgaveForOversiktsvisning } from '@io/graphql';
import { useSyncNotater } from '@state/notater';

import { Filter } from '../../state/filter';
import { Pagination } from '../../state/pagination';
import { SortKey, defaultSortation, sortRows, updateSort } from '../../state/sortation';
import styles from '../../table.module.css';

interface PåVentTableProps {
    filters: Filter<OppgaveForOversiktsvisning>[];
    filteredRows: OppgaveForOversiktsvisning[];
    pagination: Pagination | null;
    readOnly: boolean;
}

export const PåVentTable = ({ filters, filteredRows, pagination, readOnly }: PåVentTableProps) => {
    const [sort, setSort] = useState<SortState | undefined>(defaultSortation);

    const sortedRows = sort ? sortRows(sort, filteredRows) : filteredRows;

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
            aria-label="Saker som er tildelt meg og satt på vent"
            zebraStripes
        >
            <Table.Header>
                <PåVentDropdownHeaderRow filters={filters} />
                <PåVentSortHeaderRow />
            </Table.Header>
            <Table.Body>
                {paginatedRows.map((oppgave) => (
                    <PåVentOppgaveRow key={oppgave.id} oppgave={oppgave} readOnly={readOnly} />
                ))}
            </Table.Body>
        </Table>
    );
};

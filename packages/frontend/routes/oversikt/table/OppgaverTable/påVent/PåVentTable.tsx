import React from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';

import { Filter } from '../../state/filter';
import { SortKey, updateSort } from '../../state/sortation';
import { PåVentDropdownHeaderRow } from './PåVentDropdownHeaderRow';
import { PåVentOppgaveRow } from './PåVentOppgaveRow';
import { PåVentSortHeaderRow } from './PåVentSortHeaderRow';

import styles from '../../table.module.css';

interface PåVentTableProps {
    filters: Filter<OppgaveTilBehandling>[];
    oppgaver: OppgaveTilBehandling[];
    sort: SortState | undefined;
    setSort: (state: SortState | undefined) => void;
}

export const PåVentTable = ({ filters, oppgaver, sort, setSort }: PåVentTableProps) => (
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
            {oppgaver.map((oppgave) => (
                <PåVentOppgaveRow key={oppgave.id} oppgave={oppgave} />
            ))}
        </Table.Body>
    </Table>
);

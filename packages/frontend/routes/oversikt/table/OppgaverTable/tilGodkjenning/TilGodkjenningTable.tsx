import React from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';

import { Filter } from '../../state/filter';
import { SortKey, updateSort } from '../../state/sortation';
import { TilGodkjenningDropdownHeaderRow } from './TilGodkjenningDropdownHeaderRow';
import { TilGodkjenningOppgaveRow } from './TilGodkjenningOppgaveRow';
import { TilGodkjenningSortHeaderRow } from './TilGodkjenningSortHeaderRow';

import styles from '../../table.module.css';

interface TilGodkjenningTableProps {
    filters: Filter<OppgaveTilBehandling>[];
    oppgaver: OppgaveTilBehandling[];
    readOnly: boolean;
    sort: SortState | undefined;
    setSort: (state: SortState | undefined) => void;
}

export const TilGodkjenningTable = ({ filters, oppgaver, readOnly, sort, setSort }: TilGodkjenningTableProps) => (
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
            {oppgaver.map((oppgave) => (
                <TilGodkjenningOppgaveRow key={oppgave.id} oppgave={oppgave} readOnly={readOnly} />
            ))}
        </Table.Body>
    </Table>
);

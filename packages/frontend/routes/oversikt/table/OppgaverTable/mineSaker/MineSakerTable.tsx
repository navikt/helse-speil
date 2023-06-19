import React from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { Filter } from '../../state/filter';
import { SortKey, updateSort } from '../../state/sortation';
import styles from '../../table.module.css';
import { MineSakerDropdownHeaderRow } from './MineSakerDropdownHeaderRow';
import { MineSakerOppgaveRow } from './MineSakerOppgaveRow';
import { MineSakerSortHeaderRow } from './MineSakerSortHeaderRow';

interface MineSakerTableProps {
    filters: Filter<OppgaveForOversiktsvisning>[];
    oppgaver: OppgaveForOversiktsvisning[];
    sort: SortState | undefined;
    setSort: (state: SortState | undefined) => void;
}

export const MineSakerTable = ({ filters, oppgaver, sort, setSort }: MineSakerTableProps) => (
    <Table
        sort={sort}
        onSortChange={(sortKey: string | undefined) => sortKey && updateSort(sort, setSort, sortKey as SortKey)}
        className={styles.Table}
        aria-label="Saker som er tildelt meg"
        zebraStripes
    >
        <Table.Header>
            <MineSakerDropdownHeaderRow filters={filters} />
            <MineSakerSortHeaderRow />
        </Table.Header>
        <Table.Body>
            {oppgaver.map((oppgave) => (
                <MineSakerOppgaveRow key={oppgave.id} oppgave={oppgave} />
            ))}
        </Table.Body>
    </Table>
);

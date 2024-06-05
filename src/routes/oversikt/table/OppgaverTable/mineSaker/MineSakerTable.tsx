import React from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';

import { SortKey, useUpdateSort } from '../../state/sortation';
import { DateSelectHeader } from '../DateSelectHeader';
import { IngenMatchendeFiltre } from '../IngenMatchendeFiltre';
import { MineSakerOppgaveRow } from './MineSakerOppgaveRow';
import { MineSakerSortHeaderRow } from './MineSakerSortHeaderRow';

import styles from '../../table.module.css';

interface MineSakerTableProps {
    oppgaver: OppgaveTilBehandling[];
    sort: SortState | undefined;
    setSort: (state: SortState | undefined) => void;
}
export const MineSakerTable = ({ oppgaver, sort, setSort }: MineSakerTableProps) => {
    const updateSort = useUpdateSort();
    return (
        <Table
            sort={sort}
            onSortChange={(sortKey: string | undefined) => sortKey && updateSort(sort, setSort, sortKey as SortKey)}
            className={styles.Table}
            aria-label="Saker som er tildelt meg"
            zebraStripes
        >
            <Table.Header>
                <DateSelectHeader />
                <MineSakerSortHeaderRow />
            </Table.Header>
            <Table.Body>
                {oppgaver.length > 0 ? (
                    oppgaver.map((oppgave) => <MineSakerOppgaveRow key={oppgave.id} oppgave={oppgave} />)
                ) : (
                    <IngenMatchendeFiltre />
                )}
            </Table.Body>
        </Table>
    );
};

import React from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';
import { skalSeFiltermeny } from '@utils/featureToggles';

import { Filter } from '../../state/filter';
import { SortKey, useUpdateSort } from '../../state/sortation';
import { IngenMatchendeFiltre } from '../IngenMatchendeFiltre';
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

export const PåVentTable = ({ filters, oppgaver, sort, setSort }: PåVentTableProps) => {
    const updateSort = useUpdateSort();
    return (
        <Table
            sort={sort}
            onSortChange={(sortKey: string | undefined) => sortKey && updateSort(sort, setSort, sortKey as SortKey)}
            className={styles.Table}
            aria-label="Saker som er tildelt meg og satt på vent"
            zebraStripes
        >
            <Table.Header>
                {!skalSeFiltermeny && <PåVentDropdownHeaderRow filters={filters} />}
                <PåVentSortHeaderRow />
            </Table.Header>
            <Table.Body>
                {oppgaver.length > 0 ? (
                    oppgaver.map((oppgave) => <PåVentOppgaveRow key={oppgave.id} oppgave={oppgave} />)
                ) : (
                    <IngenMatchendeFiltre />
                )}
            </Table.Body>
        </Table>
    );
};

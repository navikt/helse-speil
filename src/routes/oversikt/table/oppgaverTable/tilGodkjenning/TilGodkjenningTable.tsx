import React, { ReactElement } from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';
import { SortKey, useUpdateSort } from '@oversikt/table/state/sortation';

import { IngenMatchendeFiltre } from '../IngenMatchendeFiltre';
import { TilGodkjenningOppgaveRow } from './TilGodkjenningOppgaveRow';
import { TilGodkjenningTableHeader } from './TilGodkjenningTableHeader';

import styles from '../../table.module.css';

interface TilGodkjenningTableProps {
    oppgaver: OppgaveTilBehandling[];
    sort: SortState;
}

export const TilGodkjenningTable = ({ oppgaver, sort }: TilGodkjenningTableProps): ReactElement => {
    const updateSort = useUpdateSort();
    return (
        <Table
            sort={sort}
            onSortChange={(sortKey: string | undefined) => sortKey && updateSort(sort, sortKey as SortKey)}
            className={styles.Table}
            aria-label="Saker som er klare for behandling"
            zebraStripes
        >
            <TilGodkjenningTableHeader />
            <Table.Body>
                {oppgaver.length > 0 ? (
                    oppgaver.map((oppgave) => <TilGodkjenningOppgaveRow key={oppgave.id} oppgave={oppgave} />)
                ) : (
                    <IngenMatchendeFiltre />
                )}
            </Table.Body>
        </Table>
    );
};

import React, { ReactElement } from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';
import { SortKey, useSetSortering } from '@oversikt/table/state/sortation';

import { IngenMatchendeFiltre } from '../IngenMatchendeFiltre';
import { MineSakerOppgaveRow } from './MineSakerOppgaveRow';
import { MineSakerTableHeader } from './MineSakerTableHeader';

import styles from '../../table.module.css';

interface MineSakerTableProps {
    oppgaver: OppgaveTilBehandling[];
    sort: SortState;
}

export const MineSakerTable = ({ oppgaver, sort }: MineSakerTableProps): ReactElement => {
    const setSortering = useSetSortering();
    return (
        <Table
            sort={sort}
            onSortChange={(sortKey: string | undefined) => sortKey && setSortering(sort, sortKey as SortKey)}
            className={styles.Table}
            aria-label="Saker som er tildelt meg"
            zebraStripes
        >
            <MineSakerTableHeader />
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

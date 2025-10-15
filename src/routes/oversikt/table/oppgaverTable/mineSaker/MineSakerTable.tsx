import React, { ReactElement } from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { SortKey, useSetSortering } from '@oversikt/table/state/sortation';

import { IngenMatchendeFiltre } from '../IngenMatchendeFiltre';
import { MineSakerOppgaveRow } from './MineSakerOppgaveRow';
import { MineSakerTableHeader } from './MineSakerTableHeader';

import styles from '../../table.module.css';

interface MineSakerTableProps {
    oppgaver: ApiOppgaveProjeksjon[];
    sort: SortState;
}

export const MineSakerTable = ({ oppgaver, sort }: MineSakerTableProps): ReactElement => {
    const setSortering = useSetSortering();
    return (
        <Table
            sort={sort}
            onSortChange={(sortKey: string | undefined) => sortKey && setSortering(sort, sortKey as SortKey)}
            className={styles.Table}
            aria-label="Oppgaver som er tildelt meg"
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

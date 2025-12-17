import React, { ReactElement } from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { SortKey, useSetSortering } from '@oversikt/table/state/sortation';
import styles from '@oversikt/table/table.module.css';

import { IngenMatchendeFiltre } from '../IngenMatchendeFiltre';
import { TilGodkjenningOppgaveRow } from './TilGodkjenningOppgaveRow';
import { TilGodkjenningTableHeader } from './TilGodkjenningTableHeader';

interface TilGodkjenningTableProps {
    oppgaver: ApiOppgaveProjeksjon[];
    sort: SortState;
}

export const TilGodkjenningTable = ({ oppgaver, sort }: TilGodkjenningTableProps): ReactElement => {
    const setSortering = useSetSortering();
    return (
        <Table
            sort={sort}
            onSortChange={(sortKey: string | undefined) => sortKey && setSortering(sort, sortKey as SortKey)}
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

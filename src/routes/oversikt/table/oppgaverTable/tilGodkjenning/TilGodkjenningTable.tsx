import React, { ReactElement } from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { OppgaveProjeksjon } from '@io/graphql';
import { SortKey, useSetSortering } from '@oversikt/table/state/sortation';

import { IngenMatchendeFiltre } from '../IngenMatchendeFiltre';
import { TilGodkjenningOppgaveRow } from './TilGodkjenningOppgaveRow';
import { TilGodkjenningTableHeader } from './TilGodkjenningTableHeader';

import styles from '../../table.module.css';

interface TilGodkjenningTableProps {
    oppgaver: OppgaveProjeksjon[];
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

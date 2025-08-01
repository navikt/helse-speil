import { ReactElement } from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';
import { SortKey, useSetSortering } from '@oversikt/table/state/sortation';

import { IngenMatchendeFiltre } from '../IngenMatchendeFiltre';
import { PåVentOppgaveRow } from './PåVentOppgaveRow';
import { PåVentTableHeader } from './PåVentTableHeader';

import styles from '../../table.module.css';

interface PåVentTableProps {
    oppgaver: OppgaveTilBehandling[];
    sort: SortState;
}

export const PåVentTable = ({ oppgaver, sort }: PåVentTableProps): ReactElement => {
    const setSortering = useSetSortering();
    return (
        <Table
            sort={sort}
            onSortChange={(sortKey: string | undefined) => sortKey && setSortering(sort, sortKey as SortKey)}
            className={styles.Table}
            aria-label="Oppgaver som er tildelt meg og satt på vent"
            zebraStripes
        >
            <PåVentTableHeader />
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

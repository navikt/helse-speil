import React, { ReactElement } from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { OppgaverBodySkeleton } from '@oversikt/table/oppgaverTable/OppgaverBodySkeleton';
import { SortKey, useSetSortering } from '@oversikt/table/state/sortation';
import styles from '@oversikt/table/table.module.css';

import { IngenMatchendeFiltre } from '../IngenMatchendeFiltre';
import { PåVentOppgaveRow } from './PåVentOppgaveRow';
import { PåVentTableHeader } from './PåVentTableHeader';

interface PåVentTableProps {
    oppgaver: ApiOppgaveProjeksjon[];
    sort: SortState;
    loading: boolean;
}

export const PåVentTable = ({ oppgaver, sort, loading }: PåVentTableProps): ReactElement => {
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
            <Table.Body>{loading ? <OppgaverBodySkeleton /> : <PåVentTableBody oppgaver={oppgaver} />}</Table.Body>
        </Table>
    );
};

function PåVentTableBody({ oppgaver }: { oppgaver: ApiOppgaveProjeksjon[] }) {
    if (oppgaver.length === 0) return <IngenMatchendeFiltre />;
    return oppgaver.map((oppgave) => <PåVentOppgaveRow key={oppgave.id} oppgave={oppgave} />);
}

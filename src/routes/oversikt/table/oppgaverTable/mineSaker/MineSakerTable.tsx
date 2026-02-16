import React, { ReactElement } from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { OppgaverBodySkeleton } from '@oversikt/table/oppgaverTable/OppgaverBodySkeleton';
import { SortKey, useSetSortering } from '@oversikt/table/state/sortation';
import styles from '@oversikt/table/table.module.css';

import { IngenMatchendeFiltre } from '../IngenMatchendeFiltre';
import { MineSakerOppgaveRow } from './MineSakerOppgaveRow';
import { MineSakerTableHeader } from './MineSakerTableHeader';

interface MineSakerTableProps {
    oppgaver: ApiOppgaveProjeksjon[];
    sort: SortState;
    loading: boolean;
}

export const MineSakerTable = ({ oppgaver, sort, loading }: MineSakerTableProps): ReactElement => {
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
            <Table.Body>{loading ? <OppgaverBodySkeleton /> : <MineSakerTableBody oppgaver={oppgaver} />}</Table.Body>
        </Table>
    );
};

function MineSakerTableBody({ oppgaver }: { oppgaver: ApiOppgaveProjeksjon[] }) {
    if (oppgaver.length === 0) return <IngenMatchendeFiltre />;
    return oppgaver.map((oppgave) => <MineSakerOppgaveRow key={oppgave.id} oppgave={oppgave} />);
}

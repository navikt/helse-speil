import React, { ReactElement } from 'react';

import { SortState, Table } from '@navikt/ds-react';

import { ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { OppgaverBodySkeleton } from '@oversikt/table/oppgaverTable/OppgaverBodySkeleton';
import { SortKey, useSetSortering } from '@oversikt/table/state/sortation';
import styles from '@oversikt/table/table.module.css';

import { IngenMatchendeFiltre } from '../IngenMatchendeFiltre';
import { TilGodkjenningOppgaveRow } from './TilGodkjenningOppgaveRow';
import { TilGodkjenningTableHeader } from './TilGodkjenningTableHeader';

interface TilGodkjenningTableProps {
    oppgaver: ApiOppgaveProjeksjon[];
    sort: SortState;
    loading: boolean;
}

export const TilGodkjenningTable = ({ oppgaver, sort, loading }: TilGodkjenningTableProps): ReactElement => {
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
                {loading ? <OppgaverBodySkeleton /> : <TilGodkjenningTableBody oppgaver={oppgaver} />}
            </Table.Body>
        </Table>
    );
};

function TilGodkjenningTableBody({ oppgaver }: { oppgaver: ApiOppgaveProjeksjon[] }) {
    if (oppgaver.length === 0) return <IngenMatchendeFiltre />;
    return oppgaver.map((oppgave) => <TilGodkjenningOppgaveRow key={oppgave.id} oppgave={oppgave} />);
}

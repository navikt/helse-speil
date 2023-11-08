import React from 'react';

import { Table } from '@navikt/ds-react';

import { useQueryBehandledeOppgaver } from '@state/oppgaver';

import { IngenOppgaver } from '../IngenOppgaver';
import { LinkRow } from './LinkRow';
import { HeaderCell } from './OppgaverTable/HeaderCell';
import { OppgaverTableError } from './OppgaverTableError';
import { OppgaverTableSkeleton } from './OppgaverTableSkeleton';
import { BehandletIdagPagination } from './Pagination';
import { BehandletAvCell } from './cells/BehandletAvCell';
import { BehandletTimestampCell } from './cells/BehandletTimestampCell';
import { OppgavetypeCell } from './cells/OppgavetypeCell';
import { PeriodetypeCell } from './cells/PeriodetypeCell';
import { SøkerCell } from './cells/SøkerCell';
import { usePagination } from './state/pagination';

import styles from './table.module.css';

export const BehandletIdagTable = () => {
    const { behandledeOppgaver, error, loading } = useQueryBehandledeOppgaver();
    const pagination = usePagination();

    const paginatedRows =
        pagination && behandledeOppgaver !== undefined
            ? behandledeOppgaver.slice(pagination.firstVisibleEntry, pagination.lastVisibleEntry + 1)
            : behandledeOppgaver;

    if (behandledeOppgaver !== undefined && behandledeOppgaver.length === 0) {
        return <IngenOppgaver />;
    }

    if (loading) {
        return <OppgaverTableSkeleton />;
    }

    if (error) {
        return <OppgaverTableError />;
    }

    return (
        <div className={styles.TableContainer}>
            <div className={styles.Content}>
                <div className={styles.Scrollable}>
                    <Table className={styles.Table} aria-label="Oppgaver behandlet av meg i dag" zebraStripes>
                        <Table.Header>
                            <Table.Row>
                                <HeaderCell text="Behandlet av" />
                                <HeaderCell text="Periodetype" />
                                <HeaderCell text="Oppgavetype" />
                                <HeaderCell text="Søker" />
                                <HeaderCell text="Behandlet" />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {paginatedRows?.map((oppgave) => (
                                <LinkRow aktørId={oppgave.aktorId} key={oppgave.id}>
                                    <BehandletAvCell name={oppgave.ferdigstiltAv} />
                                    <PeriodetypeCell periodetype={oppgave.periodetype} />
                                    <OppgavetypeCell oppgavetype={oppgave.oppgavetype} />
                                    <SøkerCell
                                        name={{
                                            fornavn: oppgave.personnavn.fornavn,
                                            etternavn: oppgave.personnavn.etternavn,
                                            mellomnavn: oppgave.personnavn.mellomnavn ?? null,
                                        }}
                                    />
                                    <BehandletTimestampCell time={oppgave.ferdigstiltTidspunkt} />
                                </LinkRow>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
            {behandledeOppgaver !== undefined && (
                <BehandletIdagPagination numberOfEntries={behandledeOppgaver.length} />
            )}
        </div>
    );
};

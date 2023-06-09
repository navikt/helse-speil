import { SøkerCell } from './cells/SøkerCell';
import React from 'react';

import { Table } from '@navikt/ds-react';

import { useFerdigstilteOppgaver } from '@state/oppgaver';

import { IngenOppgaver } from '../IngenOppgaver';
import { LinkRow } from './LinkRow';
import { OppgaverTableError } from './OppgaverTableError';
import { OppgaverTableSkeleton } from './OppgaverTableSkeleton';
import { Pagination } from './Pagination';
import { BehandletAvCell } from './cells/BehandletAvCell';
import { BehandletTimestampCell } from './cells/BehandletTimestampCell';
import { InntektskildeCell } from './cells/InntektskildeCell';
import { OppgavetypeCell } from './cells/OppgavetypeCell';
import { PeriodetypeCell } from './cells/PeriodetypeCell';
import { usePagination } from './state/pagination';

import styles from './table.module.css';

export const BehandletIdagTable = () => {
    const oppgaver = useFerdigstilteOppgaver();
    const pagination = usePagination();

    const paginatedRows =
        pagination && oppgaver.state === 'hasValue'
            ? oppgaver.data.slice(pagination.firstVisibleEntry, pagination.lastVisibleEntry + 1)
            : oppgaver.data;

    if (oppgaver.state === 'hasValue' && oppgaver.data.length === 0) {
        return <IngenOppgaver />;
    }

    if (oppgaver.state === 'isLoading') {
        return <OppgaverTableSkeleton />;
    }

    if (oppgaver.state === 'hasError') {
        return <OppgaverTableError />;
    }

    return (
        <div className={styles.TableContainer}>
            <div className={styles.Content}>
                <div className={styles.Scrollable}>
                    <Table className={styles.Table} aria-label="Oppgaver behandlet av meg i dag" zebraStripes>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    Behandlet av
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    Periodetype
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    Oppgavetype
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    Inntektskilde
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    Søker
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    Behandlet
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {paginatedRows?.map((oppgave) => (
                                <LinkRow aktørId={oppgave.aktorId} key={oppgave.id}>
                                    <BehandletAvCell name={oppgave.ferdigstiltAv} />
                                    <PeriodetypeCell type={oppgave.periodetype} />
                                    <OppgavetypeCell oppgavetype={oppgave.type} />
                                    <InntektskildeCell
                                        flereArbeidsgivere={oppgave.inntektstype === 'FLEREARBEIDSGIVERE'}
                                    />
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
            {oppgaver.state === 'hasValue' && <Pagination numberOfEntries={oppgaver.data.length} />}
        </div>
    );
};

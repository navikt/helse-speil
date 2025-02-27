import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { HeaderCell } from '@oversikt/table/oppgaverTable/HeaderCell';
import { useBehandledeOppgaverFeed } from '@state/behandledeOppgaver';

import { IngenOppgaver } from '../IngenOppgaver';
import { LinkRow } from './LinkRow';
import { OppgaverTableError } from './OppgaverTableError';
import { OppgaverTableSkeleton } from './OppgaverTableSkeleton';
import { Pagination } from './Pagination';
import { BehandletTimestampCell } from './cells/BehandletTimestampCell';
import { SaksbehandlerIdentCell } from './cells/SaksbehandlerIdentCell';
import { SøkerCell } from './cells/SøkerCell';

import styles from './table.module.css';

export const BehandletIdagTable = (): ReactElement => {
    const behandledeOppgaverFeed = useBehandledeOppgaverFeed();

    if (behandledeOppgaverFeed.oppgaver !== undefined && behandledeOppgaverFeed.oppgaver.length === 0) {
        return <IngenOppgaver />;
    }

    if (behandledeOppgaverFeed.loading) {
        return <OppgaverTableSkeleton />;
    }

    if (behandledeOppgaverFeed.error) {
        return <OppgaverTableError />;
    }

    return (
        <div className={styles.TableContainer}>
            <div className={styles.Content}>
                <div className={styles.Scrollable}>
                    <Table className={styles.Table} aria-label="Oppgaver behandlet av meg i dag" zebraStripes>
                        <Table.Header>
                            <Table.Row>
                                <HeaderCell text="Saksbehandler" />
                                <HeaderCell text="Beslutter" />
                                <HeaderCell text="Søker" />
                                <HeaderCell text="Behandlet" />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {behandledeOppgaverFeed.oppgaver?.map((oppgave) => (
                                <LinkRow aktørId={oppgave.aktorId} key={oppgave.id}>
                                    <SaksbehandlerIdentCell name={oppgave.saksbehandler} style={{ width: 180 }} />
                                    <SaksbehandlerIdentCell name={oppgave.beslutter} />
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
            <Pagination
                numberOfEntries={behandledeOppgaverFeed.antallOppgaver}
                numberOfPages={behandledeOppgaverFeed.numberOfPages}
                currentPage={behandledeOppgaverFeed.currentPage}
                limit={behandledeOppgaverFeed.limit}
                setPage={behandledeOppgaverFeed.setPage}
            />
        </div>
    );
};

import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { useLoadingToast } from '@hooks/useLoadingToast';
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
    const { oppgaver, antallOppgaver, error, loading, fetchMore } = useBehandledeOppgaverFeed();
    const harIkkeHentetOppgaverForGjeldendeQuery = oppgaver === undefined && loading;

    useLoadingToast({ isLoading: harIkkeHentetOppgaverForGjeldendeQuery, message: 'Henter oppgaver' });

    if (oppgaver !== undefined && antallOppgaver === 0) {
        return <IngenOppgaver />;
    }

    if (harIkkeHentetOppgaverForGjeldendeQuery) {
        return <OppgaverTableSkeleton />;
    }

    if (error) {
        return <OppgaverTableError />;
    }

    return (
        <div className={classNames(styles.TableContainer, loading && styles.Loading)}>
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
                            {oppgaver?.map((oppgave) => (
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
                antallOppgaver={antallOppgaver}
                fetchMore={(offset: number) => void fetchMore({ variables: { offset } })}
            />
        </div>
    );
};

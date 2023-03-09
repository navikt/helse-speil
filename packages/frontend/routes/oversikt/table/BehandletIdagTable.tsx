import { SøkerCell } from './rader/SøkerCell';
import React from 'react';

import { useFerdigstilteOppgaver } from '@state/oppgaver';

import { IngenOppgaver } from '../IngenOppgaver';
import { Header } from './Header';
import { LinkRow } from './LinkRow';
import { OppgaverTableError } from './OppgaverTableError';
import { OppgaverTableSkeleton } from './OppgaverTableSkeleton';
import { Pagination } from './Pagination';
import { BehandletAvCell } from './rader/BehandletAvCell';
import { BehandletTimestampCell } from './rader/BehandletTimestampCell';
import { InntektskildeCell } from './rader/InntektskildeCell';
import { OppgavetypeCell } from './rader/OppgavetypeCell';
import { PeriodetypeCell } from './rader/PeriodetypeCell';
import { StatusCell } from './rader/StatusCell';
import { usePagination } from './state/pagination';

import styles from './table.module.css';

interface BehandletIdagTableProps {}

export const BehandletIdagTable: React.FC<BehandletIdagTableProps> = () => {
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
                    <table className={styles.Table} aria-label="Oppgaver behandlet av meg i dag">
                        <thead>
                            <tr>
                                <Header scope="col" colSpan={1}>
                                    Behandlet av
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Periodetype
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Oppgavetype
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Inntektskilde
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Status
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Søker
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Behandlet
                                </Header>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRows?.map((it) => (
                                <LinkRow aktørId={it.aktorId} key={it.id}>
                                    <BehandletAvCell name={it.ferdigstiltAv} />
                                    <PeriodetypeCell type={it.periodetype} />
                                    <OppgavetypeCell oppgavetype={it.type} />
                                    <InntektskildeCell flereArbeidsgivere={it.inntektstype === 'FLEREARBEIDSGIVERE'} />
                                    <StatusCell numberOfWarnings={it.antallVarsler} />
                                    <SøkerCell
                                        name={{
                                            fornavn: it.personnavn.fornavn,
                                            etternavn: it.personnavn.etternavn,
                                            mellomnavn: it.personnavn.mellomnavn ?? null,
                                        }}
                                    />
                                    <BehandletTimestampCell time={it.ferdigstiltTidspunkt} />
                                </LinkRow>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {oppgaver.state === 'hasValue' && <Pagination numberOfEntries={oppgaver.data.length} />}
        </div>
    );
};

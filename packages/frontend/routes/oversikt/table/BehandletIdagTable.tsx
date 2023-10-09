import React from 'react';

import { Table } from '@navikt/ds-react';

import { AntallArbeidsforhold, Inntektstype } from '@io/graphql';
import { useQueryBehandledeOppgaver } from '@state/oppgaver';

import { IngenOppgaver } from '../IngenOppgaver';
import { LinkRow } from './LinkRow';
import { HeaderCell } from './OppgaverTable/HeaderCell';
import { OppgaverTableError } from './OppgaverTableError';
import { OppgaverTableSkeleton } from './OppgaverTableSkeleton';
import { Pagination } from './Pagination';
import { BehandletAvCell } from './cells/BehandletAvCell';
import { BehandletTimestampCell } from './cells/BehandletTimestampCell';
import { InntektskildeCell } from './cells/InntektskildeCell';
import { OppgavetypeCell } from './cells/OppgavetypeCell';
import { PeriodetypeCell } from './cells/PeriodetypeCell';
import { SøkerCell } from './cells/SøkerCell';
import { usePagination } from './state/pagination';

import styles from './table.module.css';

const tilAntallArbeidsforhold = (inntektstype: Inntektstype) => {
    switch (inntektstype) {
        case Inntektstype.Enarbeidsgiver:
            return AntallArbeidsforhold.EtArbeidsforhold;
        case Inntektstype.Flerearbeidsgivere:
            return AntallArbeidsforhold.FlereArbeidsforhold;
    }
};

export const BehandletIdagTable = () => {
    const oppgaverResponse = useQueryBehandledeOppgaver();
    const pagination = usePagination();

    const paginatedRows =
        pagination && oppgaverResponse.oppgaver !== undefined
            ? oppgaverResponse.oppgaver.slice(pagination.firstVisibleEntry, pagination.lastVisibleEntry + 1)
            : oppgaverResponse.oppgaver;

    if (oppgaverResponse.oppgaver !== undefined && oppgaverResponse.oppgaver.length === 0) {
        return <IngenOppgaver />;
    }

    if (oppgaverResponse.loading) {
        return <OppgaverTableSkeleton />;
    }

    if (oppgaverResponse.error) {
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
                                <HeaderCell text="Inntektskilde" />
                                <HeaderCell text="Søker" />
                                <HeaderCell text="Behandlet" />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {paginatedRows?.map((oppgave) => (
                                <LinkRow aktørId={oppgave.aktorId} key={oppgave.id}>
                                    <BehandletAvCell name={oppgave.ferdigstiltAv} />
                                    <PeriodetypeCell periodetype={oppgave.periodetype} />
                                    <OppgavetypeCell oppgavetype={oppgave.type} />
                                    <InntektskildeCell
                                        antallArbeidsforhold={tilAntallArbeidsforhold(oppgave.inntektstype)}
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
            {oppgaverResponse.oppgaver !== undefined && (
                <Pagination numberOfEntries={oppgaverResponse.oppgaver.length} />
            )}
        </div>
    );
};

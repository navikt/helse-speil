import React from 'react';

import { useFerdigstilteOppgaver } from '@state/oppgaver';

import { Body } from './Body';
import { Table } from './Table';
import { Header } from './Header';
import { LinkRow } from './LinkRow';
import { Pagination } from './Pagination';
import { SøkerCell } from './rader/SøkerCell';
import { BostedCell } from './rader/BostedCell';
import { StatusCell } from './rader/StatusCell';
import { OppgavetypeCell } from './rader/OppgavetypeCell';
import { BehandletAvCell } from './rader/BehandletAvCell';
import { BehandletTimestampCell } from './rader/BehandletTimestampCell';
import { InntektskildeCell } from './rader/InntektskildeCell';

import styles from './Table.module.css';

interface BehandletIdagTableProps {}

export const BehandletIdagTable: React.FC<BehandletIdagTableProps> = () => {
    const oppgaver = useFerdigstilteOppgaver();

    return (
        <div className={styles.TableContainer}>
            <div className={styles.Content}>
                <div className={styles.Scrollable}>
                    <Table aria-label="Oppgaver behandlet av meg i dag">
                        <thead>
                            <tr>
                                <Header scope="col" colSpan={1}>
                                    Behandlet av
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Sakstype
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Bosted
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
                        <Body>
                            {oppgaver.map((it) => (
                                <LinkRow aktørId={it.aktorId} key={it.id}>
                                    <BehandletAvCell name={it.ferdigstiltAv} />
                                    <OppgavetypeCell oppgavetype={it.type} periodetype={it.periodetype} />
                                    <BostedCell stedsnavn={it.bosted} />
                                    <InntektskildeCell type={it.inntektstype} />
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
                        </Body>
                    </Table>
                </div>
            </div>
            <Pagination numberOfEntries={oppgaver.length} />
        </div>
    );
};

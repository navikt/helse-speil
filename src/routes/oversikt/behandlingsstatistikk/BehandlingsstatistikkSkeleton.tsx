import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';
import { StatistikkOppsummertSkeleton } from '@oversikt/behandlingsstatistikk/StatistikkOppsummertSkeleton';

import { LabelCell } from './LabelCell';
import { Separator } from './Separator';

import styles from './BehandlingsstatistikkView.module.css';

const LoadingCells = (): ReactElement => {
    return (
        <>
            <Table.DataCell className={styles.datacell}>
                <LoadingShimmer />
            </Table.DataCell>
            <Table.DataCell className={styles.datacell}>
                <LoadingShimmer />
            </Table.DataCell>
            <Table.DataCell className={styles.datacell}>
                <LoadingShimmer />
            </Table.DataCell>
        </>
    );
};

export const BehandlingsstatistikkSkeleton = (): ReactElement => {
    return (
        <>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell textSize="small">MANUELT</Table.HeaderCell>
                        <Table.HeaderCell textSize="small">AUTOM.</Table.HeaderCell>
                        <Table.HeaderCell textSize="small">TILGJENGELIG</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.DataCell className={styles.datacell}>
                            <LabelCell.EnArbeidsgiver />
                        </Table.DataCell>
                        <LoadingCells />
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell className={styles.datacell}>
                            <LabelCell.FlereArbeidsgivere />
                        </Table.DataCell>
                        <LoadingCells />
                    </Table.Row>
                </Table.Body>
                <Separator />
                <Table.Body>
                    <Table.Row>
                        <Table.DataCell className={styles.datacell}>
                            <LabelCell.Førstegangsbehandling />
                        </Table.DataCell>
                        <LoadingCells />
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell className={styles.datacell}>
                            <LabelCell.Forlengelser />
                        </Table.DataCell>
                        <LoadingCells />
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell className={styles.datacell}>
                            <LabelCell.ForlengelseInfotrygd />
                        </Table.DataCell>
                        <LoadingCells />
                    </Table.Row>
                </Table.Body>
                <Separator />
                <Table.Body>
                    <Table.Row>
                        <Table.DataCell className={styles.datacell}>
                            <LabelCell.Søknad />
                        </Table.DataCell>
                        <LoadingCells />
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell className={styles.datacell}>
                            <LabelCell.Vurderingsoppgaver />
                        </Table.DataCell>
                        <LoadingCells />
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell className={styles.datacell}>
                            <LabelCell.FortroligAdresse />
                        </Table.DataCell>
                        <LoadingCells />
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell className={styles.datacell}>
                            <LabelCell.Stikkprøver />
                        </Table.DataCell>
                        <LoadingCells />
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell className={styles.datacell}>
                            <LabelCell.EgenAnsatt />
                        </Table.DataCell>
                        <LoadingCells />
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell className={styles.datacell}>
                            <LabelCell.Revurdering />
                        </Table.DataCell>
                        <LoadingCells />
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell className={styles.datacell}>
                            <LabelCell.Beslutter />
                        </Table.DataCell>
                        <LoadingCells />
                    </Table.Row>
                </Table.Body>
                <Separator />
            </Table>
            <Table>
                <Table.Body>
                    <StatistikkOppsummertSkeleton tittel="TILGJENGELIG"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="FULLFØRTE SAKER I DAG"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="MANUELT"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="AUTOMATISK"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="ANNULLERT"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="AVVIST"></StatistikkOppsummertSkeleton>
                </Table.Body>
            </Table>
        </>
    );
};

import { ReactElement } from 'react';

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
                        <Table.HeaderCell textSize="small" scope="col">
                            OPPGAVETYPE
                        </Table.HeaderCell>
                        <Table.HeaderCell textSize="small" scope="col">
                            MANUELT
                        </Table.HeaderCell>
                        <Table.HeaderCell textSize="small" scope="col">
                            AUTOM.
                        </Table.HeaderCell>
                        <Table.HeaderCell textSize="small" scope="col">
                            TILGJENGELIG
                        </Table.HeaderCell>
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
                    <Separator />
                </Table.Body>
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
                    <Separator />
                </Table.Body>
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
                    <Separator />
                </Table.Body>
            </Table>
            <Table>
                <Table.Body>
                    <StatistikkOppsummertSkeleton tittel="TILGJENGELIG"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="FULLFØRTE OPPGAVER I DAG"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="MANUELT"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="AUTOMATISK"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="ANNULLERT"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="AVVIST"></StatistikkOppsummertSkeleton>
                </Table.Body>
            </Table>
        </>
    );
};

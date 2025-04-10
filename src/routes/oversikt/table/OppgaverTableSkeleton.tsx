import React, { ReactElement } from 'react';

import { HStack, Skeleton, Table, VStack } from '@navikt/ds-react';

import styles from './table.module.css';

export const OppgaverTableSkeleton = (): ReactElement => (
    <VStack marginBlock="4">
        <FilterChipsSkeleton />
        <div className={styles.Content}>
            <div className={styles.Scrollable}>
                <Table className={styles.Table} zebraStripes>
                    <Table.Header>
                        <DateSelectHeaderSkeleton />
                        <SortHeaderRowSkeleton />
                    </Table.Header>
                    <Table.Body>
                        <BodyRowSkeleton />
                        <BodyRowSkeleton />
                        <BodyRowSkeleton />
                        <BodyRowSkeleton />
                        <BodyRowSkeleton />
                        <BodyRowSkeleton />
                        <BodyRowSkeleton />
                    </Table.Body>
                </Table>
            </div>
        </div>
    </VStack>
);

export const BehandledeOppgaverTableSkeleton = (): ReactElement => (
    <div className={styles.TableContainer}>
        <div className={styles.Content}>
            <div className={styles.Scrollable}>
                <Table className={styles.Table} zebraStripes>
                    <Table.Header>
                        <BehandletOppgaveHeaderSkeleton />
                    </Table.Header>
                    <Table.Body>
                        <BehandletOppgaveRowSkeleton saksbehandler={true} beslutter={true} />
                        <BehandletOppgaveRowSkeleton saksbehandler={true} beslutter={false} />
                        <BehandletOppgaveRowSkeleton saksbehandler={true} beslutter={true} />
                        <BehandletOppgaveRowSkeleton saksbehandler={true} beslutter={true} />
                        <BehandletOppgaveRowSkeleton saksbehandler={true} beslutter={false} />
                        <BehandletOppgaveRowSkeleton saksbehandler={true} beslutter={false} />
                    </Table.Body>
                </Table>
            </div>
        </div>
    </div>
);

const FilterChipsSkeleton = (): ReactElement => (
    <div className={styles.filterchipsskeleton}>
        <HStack gap="2" wrap={false}>
            <Skeleton height={48} width={140} />
            <Skeleton height={48} width={100} />
            <Skeleton height={48} width={120} />
        </HStack>
    </div>
);

const DateSelectHeaderSkeleton = (): ReactElement => (
    <Table.Row className={styles.datoselectskeleton}>
        <Table.DataCell />
        <Table.DataCell />
        <Table.DataCell className={styles.selecttdskeleton}>
            <Skeleton height={40} width={140} />
        </Table.DataCell>
    </Table.Row>
);

const SortHeaderRowSkeleton = (): ReactElement => (
    <Table.Row className={styles.sortheaderrowskeleton}>
        <Table.ColumnHeader style={{ width: 180 }}>
            <Skeleton height={40} width={120} />
        </Table.ColumnHeader>
        <Table.DataCell />
        <Table.ColumnHeader style={{ paddingLeft: 16 }}>
            <Skeleton height={40} width={140} />
        </Table.ColumnHeader>
        <Table.DataCell />
        <Table.DataCell />
    </Table.Row>
);

const BodyRowSkeleton = (): ReactElement => (
    <Table.Row className={styles.bodyrowskeleton}>
        <Table.DataCell style={{ width: 180 }}>
            <Skeleton width={90} height={32} />
        </Table.DataCell>
        <Table.DataCell>
            <HStack gap="3" wrap={false}>
                <Skeleton width={96} height={32} />
                <Skeleton width={96} height={32} />
                <Skeleton width={96} height={32} />
            </HStack>
        </Table.DataCell>
        <Table.DataCell style={{ width: 140 }}>
            <Skeleton width={120} height={32} />
        </Table.DataCell>
        <Table.DataCell style={{ paddingRight: 0 }}>
            <Skeleton variant="circle" width={24} height={24} />
        </Table.DataCell>
        <Table.DataCell />
    </Table.Row>
);

const BehandletOppgaveRowSkeleton = ({
    saksbehandler,
    beslutter,
}: {
    saksbehandler: boolean;
    beslutter: boolean;
}): ReactElement => (
    <Table.Row className={styles.bodyrowskeleton}>
        <Table.DataCell style={{ width: 140 }}>{saksbehandler && <Skeleton width={90} height={32} />}</Table.DataCell>
        <Table.DataCell>{beslutter && <Skeleton width={90} height={32} />}</Table.DataCell>
        <Table.DataCell style={{ width: 140 }}>
            <Skeleton width={180} height={32} />
        </Table.DataCell>
        <Table.DataCell style={{ paddingRight: 0 }}>
            <Skeleton width={90} height={32} />
        </Table.DataCell>
    </Table.Row>
);
const BehandletOppgaveHeaderSkeleton = (): ReactElement => (
    <Table.Row>
        <Table.HeaderCell>
            <Skeleton width={110} height={40} />
        </Table.HeaderCell>
        <Table.HeaderCell>
            <Skeleton width={80} height={40} />
        </Table.HeaderCell>
        <Table.HeaderCell>
            <Skeleton width={80} height={40} />
        </Table.HeaderCell>
        <Table.HeaderCell>
            <Skeleton width={90} height={40} />
        </Table.HeaderCell>
    </Table.Row>
);

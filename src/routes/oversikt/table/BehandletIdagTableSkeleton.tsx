import React, { ReactElement } from 'react';

import { HStack, Skeleton, Table, VStack } from '@navikt/ds-react';

import styles from './table.module.css';

export const BehandletIdagTableSkeleton = (): ReactElement => (
    <VStack marginBlock="space-16">
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

const FilterChipsSkeleton = (): ReactElement => (
    <div className={styles.filterchipsskeleton}>
        <HStack gap="space-8" wrap={false}>
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
            <HStack gap="space-12" wrap={false}>
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

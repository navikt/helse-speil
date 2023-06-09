import React from 'react';

import { Table } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';

import styles from './table.module.css';

export const OppgaverTableSkeleton = () => {
    return (
        <div className={styles.TableContainer}>
            <div className={styles.Content}>
                <div className={styles.Scrollable}>
                    <Table className={styles.Table}>
                        <Table.Header>
                            <Table.Row className={styles.DropdownHeader}>
                                <HeaderCellSkeleton />
                                <HeaderCellSkeleton />
                                <HeaderCellSkeleton />
                                <HeaderCellSkeleton />
                                <HeaderCellSkeleton />
                                <HeaderCellSkeleton />
                            </Table.Row>
                            <Table.Row>
                                <HeaderCellSkeleton />
                                <HeaderCellSkeleton />
                                <HeaderCellSkeleton />
                                <HeaderCellSkeleton />
                                <HeaderCellSkeleton />
                                <HeaderCellSkeleton />
                                <HeaderCellSkeleton />
                                <HeaderCellSkeleton />
                                <Table.HeaderCell scope="col" colSpan={1} />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <BodyRowSkeleton />
                            <BodyRowSkeleton />
                            <BodyRowSkeleton />
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </div>
    );
};

const HeaderCellSkeleton = () => (
    <Table.HeaderCell scope="col" colSpan={1}>
        <LoadingShimmer />
    </Table.HeaderCell>
);

const BodyCellSkeleton = () => (
    <Table.DataCell>
        <div className={styles.cellSkeleton}>
            <LoadingShimmer />
        </div>
    </Table.DataCell>
);

const BodyRowSkeleton = () => (
    <Table.Row>
        <BodyCellSkeleton />
        <BodyCellSkeleton />
        <BodyCellSkeleton />
        <BodyCellSkeleton />
        <BodyCellSkeleton />
        <BodyCellSkeleton />
        <BodyCellSkeleton />
        <BodyCellSkeleton />
        <BodyCellSkeleton />
    </Table.Row>
);

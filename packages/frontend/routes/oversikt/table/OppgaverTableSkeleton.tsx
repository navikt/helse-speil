import React from 'react';

import { Table } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';

import { CellContent } from './cells/CellContent';

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
                            <Table.Row>
                                <CellSkeleton width={128} />
                                <CellSkeleton width={130} />
                                <CellSkeleton width={130} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={100} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={100} />
                            </Table.Row>
                            <Table.Row>
                                <CellSkeleton width={128} />
                                <CellSkeleton width={130} />
                                <CellSkeleton width={130} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={100} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={100} />
                            </Table.Row>
                            <Table.Row>
                                <CellSkeleton width={128} />
                                <CellSkeleton width={130} />
                                <CellSkeleton width={130} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={100} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={100} />
                            </Table.Row>
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

interface CellSkeletonProps {
    width: number;
}

const CellSkeleton = ({ width }: CellSkeletonProps) => {
    return (
        <Table.DataCell>
            <CellContent width={width}>
                <LoadingShimmer />
            </CellContent>
        </Table.DataCell>
    );
};

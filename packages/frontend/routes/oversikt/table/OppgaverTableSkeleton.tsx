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
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" colSpan={1}>
                                    <LoadingShimmer style={{ width: 100 }} />
                                </Table.HeaderCell>
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

import React from 'react';

import { LoadingShimmer } from '@components/LoadingShimmer';

import { Cell } from './Cell';
import { Header } from './Header';
import { Row } from './Row';
import { CellContent } from './rader/CellContent';

import styles from './table.module.css';

interface CellSkeletonProps {
    width: number;
}

const CellSkeleton: React.FC<CellSkeletonProps> = ({ width }) => {
    return (
        <Cell>
            <CellContent width={width}>
                <LoadingShimmer />
            </CellContent>
        </Cell>
    );
};

export const OppgaverTableSkeleton: React.FC = () => {
    return (
        <div className={styles.TableContainer}>
            <div className={styles.Content}>
                <div className={styles.Scrollable}>
                    <table className={styles.Table}>
                        <thead>
                            <tr className={styles.DropdownHeader}>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Header>
                            </tr>
                            <tr className={styles.SortHeader}>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer />
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <LoadingShimmer style={{ width: 100 }} />
                                </Header>
                            </tr>
                        </thead>
                        <tbody>
                            <Row>
                                <CellSkeleton width={128} />
                                <CellSkeleton width={130} />
                                <CellSkeleton width={130} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={100} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={100} />
                            </Row>
                            <Row>
                                <CellSkeleton width={128} />
                                <CellSkeleton width={130} />
                                <CellSkeleton width={130} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={100} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={100} />
                            </Row>
                            <Row>
                                <CellSkeleton width={128} />
                                <CellSkeleton width={130} />
                                <CellSkeleton width={130} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={100} />
                                <CellSkeleton width={128} />
                                <CellSkeleton width={100} />
                            </Row>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

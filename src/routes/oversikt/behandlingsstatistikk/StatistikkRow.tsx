import React, { PropsWithChildren, ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { Antall } from '@io/graphql';

import styles from './BehandlingsstatistikkView.module.css';

interface StatistikkRowProps {
    antall: Antall;
}

export const StatistikkRow = ({ children, antall }: PropsWithChildren<StatistikkRowProps>): ReactElement => {
    return (
        <Table.Row>
            <Table.DataCell className={styles.datacell} textSize="small">
                {children}
            </Table.DataCell>
            <Table.DataCell className={styles.datacell} textSize="small">
                {antall.manuelt}
            </Table.DataCell>
            <Table.DataCell className={styles.datacell} textSize="small">
                {antall.automatisk}
            </Table.DataCell>
            <Table.DataCell className={styles.datacell} textSize="small">
                {antall.tilgjengelig}
            </Table.DataCell>
        </Table.Row>
    );
};

import React, { PropsWithChildren, ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { ApiAntall } from '@io/rest/generated/spesialist.schemas';

import styles from './BehandlingsstatistikkView.module.css';

interface StatistikkRowProps {
    antall: ApiAntall;
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

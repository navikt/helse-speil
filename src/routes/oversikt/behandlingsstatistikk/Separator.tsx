import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import styles from './Separator.module.css';

export const Separator = (): ReactElement => {
    return (
        <Table.Row className={styles.Separator}>
            <Table.DataCell colSpan={4}>
                <hr />
            </Table.DataCell>
        </Table.Row>
    );
};

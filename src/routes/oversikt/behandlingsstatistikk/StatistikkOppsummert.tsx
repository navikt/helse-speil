import React, { PropsWithChildren, ReactElement } from 'react';

import { BodyShort, HStack, Table } from '@navikt/ds-react';

import styles from './StatistikkOppsummering.module.scss';

interface StatistikkOppsummertProps {
    antall: number;
    tittel: string;
}

export const StatistikkOppsummert = ({
    tittel,
    antall,
}: PropsWithChildren<StatistikkOppsummertProps>): ReactElement => {
    return (
        <Table.Row>
            <Table.DataCell className={styles.datacell}>
                <HStack justify="space-between">
                    <BodyShort>{tittel}:</BodyShort>
                    <BodyShort weight="semibold">{antall}</BodyShort>
                </HStack>
            </Table.DataCell>
        </Table.Row>
    );
};

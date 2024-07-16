import React, { PropsWithChildren, ReactElement } from 'react';

import { BodyShort, Table } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';

import styles from './StatistikkOppsummering.module.scss';

export const StatistikkOppsummertSkeleton = ({ tittel }: PropsWithChildren<{ tittel: string }>): ReactElement => {
    return (
        <Table.Row>
            <Table.DataCell className={styles.text}>
                <BodyShort className={styles.shimmer}>
                    {tittel}:<LoadingShimmer />
                </BodyShort>
            </Table.DataCell>
        </Table.Row>
    );
};

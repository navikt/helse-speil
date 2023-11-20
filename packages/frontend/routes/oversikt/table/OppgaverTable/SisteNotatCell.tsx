import React from 'react';

import { Table } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { useNotaterForVedtaksperiode } from '@state/notater';

import styles from './SisteNotatCell.module.css';

interface SisteNotatCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    vedtaksperiodeId: string;
    erPåVent?: boolean;
}

export const SisteNotatCell = ({ vedtaksperiodeId, erPåVent }: SisteNotatCellProps) => {
    const sisteNotat = useNotaterForVedtaksperiode(vedtaksperiodeId).shift();
    return erPåVent ? (
        <Table.DataCell className={styles.sistenotat}>
            <AnonymizableText>{sisteNotat?.tekst}</AnonymizableText>
        </Table.DataCell>
    ) : (
        <Table.DataCell className={styles.sistenotat} />
    );
};

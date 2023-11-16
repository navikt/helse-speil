import React from 'react';

import { Table } from '@navikt/ds-react';

import { useNotaterForVedtaksperiode } from '@state/notater';

import styles from './SisteNotatCell.module.css';

interface SisteNotatCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    vedtaksperiodeId: string;
    erPåVent?: boolean;
}

export const SisteNotatCell = ({ vedtaksperiodeId, erPåVent }: SisteNotatCellProps) => {
    const sisteNotat = useNotaterForVedtaksperiode(vedtaksperiodeId).shift();
    return erPåVent ? (
        <Table.DataCell scope="col" colSpan={1} className={styles.sistenotat}>
            {sisteNotat?.tekst}
        </Table.DataCell>
    ) : (
        <Table.DataCell className={styles.sistenotat} />
    );
};

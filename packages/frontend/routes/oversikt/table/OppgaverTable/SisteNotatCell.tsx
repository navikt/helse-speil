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
    return (
        <Table.DataCell className={styles.sistenotat}>
            {erPåVent && <SisteNotat vedtaksperiodeId={vedtaksperiodeId} />}
        </Table.DataCell>
    );
};

const SisteNotat = ({ vedtaksperiodeId }: Pick<SisteNotatCellProps, 'vedtaksperiodeId'>) => {
    const sisteNotat = useNotaterForVedtaksperiode(vedtaksperiodeId).shift();
    return <AnonymizableText>{sisteNotat?.tekst}</AnonymizableText>;
};

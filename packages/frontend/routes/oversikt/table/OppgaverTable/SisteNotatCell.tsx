import React from 'react';

import { Table } from '@navikt/ds-react';

import { useNotaterForVedtaksperiode } from '@state/notater';

interface SisteNotatCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    vedtaksperiodeId: string;
}

export const SisteNotatCell = ({ vedtaksperiodeId }: SisteNotatCellProps) => {
    const sisteNotat = useNotaterForVedtaksperiode(vedtaksperiodeId).shift();
    return (
        <Table.DataCell scope="col" colSpan={1}>
            {sisteNotat?.tekst}
        </Table.DataCell>
    );
};

import React, { ReactNode } from 'react';

import { Table } from '@navikt/ds-react';

import { TableCellWrapper } from './TableCellWrapper';

interface TabelCellProps {
    content: ReactNode;
    ikon?: ReactNode;
}

export const TableCell = ({ content, ikon }: TabelCellProps) => (
    <Table.DataCell>
        <TableCellWrapper content={content} ikon={ikon} />
    </Table.DataCell>
);

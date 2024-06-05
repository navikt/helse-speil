import React, { ReactNode } from 'react';

import { TableCellWrapper } from './TableCellWrapper';

interface TabelCellProps {
    content: ReactNode;
    ikon?: ReactNode;
}

export const TableCell = ({ content, ikon }: TabelCellProps) => (
    <td>
        <TableCellWrapper content={content} ikon={ikon} />
    </td>
);

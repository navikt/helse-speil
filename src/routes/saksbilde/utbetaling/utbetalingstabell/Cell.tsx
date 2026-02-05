import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { cn } from '@utils/tw';

import styles from './Cell.module.css';

interface CellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    italic?: boolean;
}

export const Cell = ({ className, italic, children }: CellProps): ReactElement => (
    <Table.DataCell className={cn(className, italic && styles.italic)}>{children}</Table.DataCell>
);

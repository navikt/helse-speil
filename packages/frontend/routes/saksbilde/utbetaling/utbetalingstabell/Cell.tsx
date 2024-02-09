import classNames from 'classnames';
import React from 'react';

import styles from './Cell.module.css';

interface CellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
    italic?: boolean;
}

export const Cell: React.FC<CellProps> = (props, italic = false) => (
    <td {...props} className={classNames(props.className, italic && styles.italic)} />
);

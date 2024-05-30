import classNames from 'classnames';
import React from 'react';

import styles from './Cell.module.css';

interface CellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    italic?: boolean;
}

export const Cell: React.FC<CellProps> = (props) => (
    <td className={classNames(props.className, props.italic && styles.italic)}>{props.children}</td>
);

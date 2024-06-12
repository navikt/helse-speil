import classNames from 'classnames';
import React, { ReactElement } from 'react';

import styles from './Cell.module.css';

interface CellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    italic?: boolean;
}

export const Cell = ({ className, italic, children }: CellProps): ReactElement => (
    <td className={classNames(className, italic && styles.italic)}>{children}</td>
);

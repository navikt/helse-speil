import classNames from 'classnames';
import React from 'react';

import styles from './Cell.module.css';

export const Cell: React.FC<React.HTMLAttributes<HTMLTableCellElement>> = ({ className, ...cellProps }) => {
    return <td className={classNames(styles.Cell, className)} {...cellProps} />;
};

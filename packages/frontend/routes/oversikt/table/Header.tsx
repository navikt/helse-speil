import classNames from 'classnames';
import React from 'react';

import styles from './Header.module.css';

export const Header: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
    className,
    children,
    ...tableCellProps
}) => {
    return (
        <th className={classNames(styles.Header, className)} {...tableCellProps}>
            {children}
        </th>
    );
};

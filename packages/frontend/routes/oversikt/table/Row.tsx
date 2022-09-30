import classNames from 'classnames';
import React from 'react';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const Row: React.FC<RowProps> = ({ className, children, ...rowProps }) => {
    return (
        <tr className={classNames(className)} {...rowProps}>
            {children}
        </tr>
    );
};

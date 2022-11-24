import classNames from 'classnames';
import React from 'react';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const Row = React.forwardRef<HTMLTableRowElement, RowProps>(({ className, children, ...rowProps }, ref) => {
    return (
        <tr ref={ref} className={classNames(className)} {...rowProps}>
            {children}
        </tr>
    );
});

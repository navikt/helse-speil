import classNames from 'classnames';
import React from 'react';

import styles from './CellContent.module.css';

interface CellContentProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: number;
}

export const CellContent = React.forwardRef<HTMLDivElement, CellContentProps>(
    ({ width, className, ...divProps }, ref) => {
        return (
            <div
                ref={ref}
                style={typeof width === 'number' ? ({ '--width': `${width}px` } as React.CSSProperties) : {}}
                className={classNames(styles.CellContent, className)}
                {...divProps}
            />
        );
    },
);

import styles from './CellContent.module.scss';
import classNames from 'classnames';
import React from 'react';

interface CellContentProps extends React.HTMLAttributes<HTMLDivElement> {
    flexEnd?: boolean;
}

export const CellContent = ({ children, className = '', flexEnd = false }: CellContentProps) => (
    <div className={classNames(styles.cellcontent, className, flexEnd && styles['cellcontent__flexend'])}>
        {children}
    </div>
);

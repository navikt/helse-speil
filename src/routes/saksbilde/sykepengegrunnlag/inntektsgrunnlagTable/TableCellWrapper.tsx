import React, { ReactNode } from 'react';

import styles from './TableCellWrapper.module.css';

interface TableCellWrapperProps {
    content: ReactNode;
    ikon?: ReactNode;
}

export const TableCellWrapper = ({ content, ikon }: TableCellWrapperProps) => (
    <span className={styles.tableCellWrapper}>
        {content}
        <span className={styles.ikonWrapper}>{ikon && ikon}</span>
    </span>
);

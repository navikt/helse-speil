import classNames from 'classnames';
import React, { ReactElement } from 'react';

import styles from './CellContent.module.scss';

interface CellContentProps extends React.HTMLAttributes<HTMLDivElement> {
    flexEnd?: boolean;
}

export const CellContent = ({ children, className = '', flexEnd = false }: CellContentProps): ReactElement => (
    <div className={classNames(styles.cellcontent, className, flexEnd && styles['cellcontent__flexend'])}>
        {children}
    </div>
);

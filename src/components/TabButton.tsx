import React, { ReactElement } from 'react';

import { cn } from '@utils/tw';

import styles from './TabButton.module.scss';

interface TabButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}

export const TabButton = ({ children, active = false, className = '', onClick }: TabButtonProps): ReactElement => (
    <button className={cn(styles.tab, active && styles.active, className)} onClick={onClick}>
        {children}
    </button>
);

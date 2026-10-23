import React, { ReactElement } from 'react';

import { cn } from '@utils/tw';

import styles from './TabButton.module.scss';

interface TabButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}

export const TabButton = ({ children, active = false, className = '', ...rest }: TabButtonProps): ReactElement => (
    <button {...rest} className={cn(styles.tab, active && styles.active, className)}>
        {children}
    </button>
);

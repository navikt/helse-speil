import React, { ReactElement } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { cn } from '@utils/tw';

import styles from './TabButton.module.scss';

interface TabButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    label: string;
    active?: boolean;
}

export const TabButton = ({
    label,
    children,
    active = false,
    className = '',
    ...rest
}: TabButtonProps): ReactElement => (
    <Tooltip content={label}>
        <button {...rest} className={cn(styles.tab, active && styles.active, className)}>
            {children}
        </button>
    </Tooltip>
);

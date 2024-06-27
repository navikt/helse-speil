import classNames from 'classnames';
import React, { ReactElement } from 'react';

import styles from './TabButton.module.scss';

interface TabButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    disabled?: boolean;
}

export const TabButton = ({
    children,
    active = false,
    disabled = false,
    className = '',
    onClick,
}: TabButtonProps): ReactElement => (
    <button
        className={classNames(styles.tab, active && styles.tab__active, disabled && styles.tab__disabled, className)}
        onClick={onClick}
    >
        {children}
    </button>
);

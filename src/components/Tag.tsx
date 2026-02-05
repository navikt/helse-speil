import React, { PropsWithChildren, ReactElement } from 'react';

import { cn } from '@utils/tw';

import styles from './Tag.module.css';

interface TagProps {
    color: 'purple' | 'red' | 'green' | 'orange' | 'blue' | 'gray';
}

export const Tag = ({ children, color }: PropsWithChildren<TagProps>): ReactElement => {
    return <span className={cn(styles.Tag, styles[color])}>{children}</span>;
};

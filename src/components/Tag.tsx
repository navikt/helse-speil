import classNames from 'classnames';
import React, { ReactElement } from 'react';

import styles from './Tag.module.css';

interface TagProps {
    children: string;
    color: 'purple' | 'red' | 'green' | 'orange' | 'blue' | 'gray';
}

export const Tag = ({ children, color }: TagProps): ReactElement => {
    return <span className={classNames(styles.Tag, styles[color])}>{children}</span>;
};

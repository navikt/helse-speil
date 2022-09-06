import React from 'react';
import classNames from 'classnames';

import styles from './Tag.module.css';

interface TagProps {
    children: string;
    color: 'purple' | 'red' | 'green' | 'orange' | 'blue';
}

export const Tag: React.FC<TagProps> = ({ children, color }) => {
    return <span className={classNames(styles.Tag, styles[color])}>{children}</span>;
};
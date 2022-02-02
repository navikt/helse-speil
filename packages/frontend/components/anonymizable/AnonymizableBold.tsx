import React from 'react';
import classNames from 'classnames';
import { Bold } from '../Bold';

import styles from './Anonymous.module.css';

export const AnonymizableBold: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
    children,
    className,
    ...paragraphProps
}) => {
    return (
        <Bold className={classNames(styles.Anonymous, className)} {...paragraphProps}>
            {children}
        </Bold>
    );
};

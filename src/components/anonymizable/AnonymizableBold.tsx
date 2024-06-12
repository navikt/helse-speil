import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { Bold } from '../Bold';

import styles from './Anonymous.module.css';

export const AnonymizableBold = ({
    children,
    className,
    ...paragraphProps
}: React.HTMLAttributes<HTMLParagraphElement>): ReactElement => {
    return (
        <Bold className={classNames(styles.Anonymous, className)} {...paragraphProps}>
            {children}
        </Bold>
    );
};

import classNames from 'classnames';
import React, { ReactElement } from 'react';

import styles from './LoadingShimmer.module.css';

export const LoadingShimmer = ({ className, ...divProps }: React.HTMLAttributes<HTMLDivElement>): ReactElement => {
    return <span className={classNames(styles.LoadingShimmer, className)} {...divProps} />;
};

import React from 'react';
import classNames from 'classnames';

import styles from './LoadingShimmer.module.css';

export const LoadingShimmer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...divProps }) => {
    return <span className={classNames(styles.LoadingShimmer, className)} {...divProps} />;
};

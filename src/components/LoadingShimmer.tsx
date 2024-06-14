import classNames from 'classnames';
import React, { ReactElement } from 'react';

import styles from './LoadingShimmer.module.css';

type LoadingShimmerProps = React.HTMLAttributes<HTMLDivElement>;

export const LoadingShimmer = ({ className, ...divProps }: LoadingShimmerProps): ReactElement => {
    return <span className={classNames(styles.LoadingShimmer, className)} {...divProps} />;
};

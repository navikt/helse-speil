import React, { ReactElement } from 'react';

import { cn } from '@utils/tw';

import styles from './LoadingShimmer.module.css';

type LoadingShimmerProps = React.HTMLAttributes<HTMLDivElement>;

export const LoadingShimmer = ({ className, ...divProps }: LoadingShimmerProps): ReactElement => {
    return <span className={cn(styles.LoadingShimmer, className)} {...divProps} />;
};

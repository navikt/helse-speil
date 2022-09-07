import React from 'react';

import styles from './LoadingShimmer.module.css';

export const LoadingShimmer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ ...divProps }) => {
    return <span className={styles.LoadingShimmer} {...divProps} />;
};

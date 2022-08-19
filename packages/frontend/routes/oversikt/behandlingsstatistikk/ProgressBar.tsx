import React from 'react';
import classNames from 'classnames';

import styles from './ProgressBar.module.css';

interface ProgressBarProps extends React.ProgressHTMLAttributes<HTMLProgressElement> {}

export const ProgressBar: React.FC<ProgressBarProps> = ({ className, ...progressProps }) => {
    return <progress className={classNames(styles.ProgressBar, className)} {...progressProps} />;
};

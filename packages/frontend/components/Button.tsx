import classNames from 'classnames';
import React from 'react';

import styles from './Button.module.css';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => {
    return <button className={classNames(styles.Button, className)} {...props} />;
};

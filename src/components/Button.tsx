import classNames from 'classnames';
import React from 'react';

import styles from './Button.module.css';

export const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return <button className={classNames(styles.Button, className)} {...props} />;
};

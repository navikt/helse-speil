import React, { PropsWithChildren, ReactElement } from 'react';

import styles from './LinkText.module.css';

interface LinkTextProps extends PropsWithChildren {}

export const LinkText = ({ children }: LinkTextProps): ReactElement => {
    return <span className={styles.linkText}>{children}</span>;
};

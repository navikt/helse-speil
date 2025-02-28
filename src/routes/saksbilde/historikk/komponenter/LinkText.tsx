import React, { PropsWithChildren, ReactElement } from 'react';

import styles from './LinkText.module.css';

export const LinkText = ({ children }: PropsWithChildren): ReactElement => {
    return <span className={styles.linkText}>{children}</span>;
};

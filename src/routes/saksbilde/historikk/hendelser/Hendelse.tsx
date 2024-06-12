import styles from './Hendelse.module.scss';
import classNames from 'classnames';
import React, { ReactElement, ReactNode } from 'react';

import { Bold } from '@components/Bold';
import { LoadingShimmer } from '@components/LoadingShimmer';

interface HendelseProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title'> {
    title: ReactNode;
    icon?: ReactNode;
}

export const Hendelse = ({ icon, title, className, children, ...liProps }: HendelseProps): ReactElement => {
    return (
        <li className={classNames(styles.hendelse, className)} {...liProps}>
            <div className={styles.iconContainer}>{icon}</div>
            <div className={styles.content}>
                <Bold>{title}</Bold>
                {children}
            </div>
        </li>
    );
};

export const HendelseSkeleton = (): ReactElement => {
    return (
        <li className={styles.hendelse}>
            <div className={styles.iconContainer} />
            <div className={styles.content}>
                <LoadingShimmer style={{ height: 20, marginBottom: 4 }} />
                <LoadingShimmer style={{ height: 20 }} />
            </div>
        </li>
    );
};

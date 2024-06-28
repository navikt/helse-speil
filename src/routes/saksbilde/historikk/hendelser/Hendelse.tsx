import classNames from 'classnames';
import React, { ReactElement, ReactNode } from 'react';

import { Bold } from '@components/Bold';
import { LoadingShimmer } from '@components/LoadingShimmer';

import styles from './Hendelse.module.scss';

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

type HendelseSkeletonProps = {
    enLinje?: boolean;
};

export const HendelseSkeleton = ({ enLinje }: HendelseSkeletonProps): ReactElement => {
    return (
        <li className={styles.hendelse}>
            <div className={styles.iconContainer}>
                <LoadingShimmer style={{ height: 20, marginBottom: 4 }} />
            </div>
            <div className={styles.content}>
                <LoadingShimmer style={{ height: 20, marginBottom: 4 }} />
                {!enLinje && <LoadingShimmer style={{ height: 20, width: 74, marginBottom: 4 }} />}
                {!enLinje && <LoadingShimmer style={{ height: 20, width: 120 }} />}
            </div>
        </li>
    );
};

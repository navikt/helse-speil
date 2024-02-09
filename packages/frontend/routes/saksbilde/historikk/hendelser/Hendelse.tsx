import styles from './Hendelse.module.scss';
import classNames from 'classnames';
import React from 'react';

import { Bold } from '@components/Bold';
import { FlexColumn } from '@components/Flex';
import { LoadingShimmer } from '@components/LoadingShimmer';

interface HendelseProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title'> {
    title: ReactNode;
    icon?: ReactNode;
}

export const Hendelse: React.FC<HendelseProps> = ({ icon, title, className, children, ...liProps }) => {
    return (
        <li className={classNames(styles.hendelse, className)} {...liProps}>
            <div className={styles.iconContainer}>{icon}</div>
            <FlexColumn className={styles.content}>
                <Bold>{title}</Bold>
                {children}
            </FlexColumn>
        </li>
    );
};

export const HendelseSkeleton: React.FC = () => {
    return (
        <li className={styles.hendelse}>
            <div className={styles.iconContainer} />
            <FlexColumn className={styles.content}>
                <LoadingShimmer style={{ height: 20, marginBottom: 4 }} />
                <LoadingShimmer style={{ height: 20 }} />
            </FlexColumn>
        </li>
    );
};

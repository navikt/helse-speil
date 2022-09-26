import React from 'react';
import classNames from 'classnames';

import { Bold } from '@components/Bold';
import { FlexColumn } from '@components/Flex';
import { LoadingShimmer } from '@components/LoadingShimmer';

import styles from './Hendelse.module.css';
import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';
import { HendelseDate } from './HendelseDate';

interface HendelseProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title'> {
    title: ReactNode;
    icon?: ReactNode;
    timestamp?: DateString;
    ident?: Maybe<string>;
    details?: ReactNode;
    openText?: string;
    closeText?: string;
}

export const Hendelse: React.FC<HendelseProps> = ({
    icon,
    title,
    timestamp,
    ident,
    className,
    children,
    details,
    openText,
    closeText,
    ...liProps
}) => {
    return (
        <li className={classNames(styles.Hendelse, className)} {...liProps}>
            <div className={styles.IconContainer}>{icon}</div>
            <FlexColumn className={styles.Content}>
                <Bold>{title}</Bold>
                {children}
                <HendelseDate timestamp={timestamp} ident={ident} />
                {details && (
                    <ExpandableHistorikkContent openText={openText} closeText={closeText} fullWidth>
                        {details}
                    </ExpandableHistorikkContent>
                )}
            </FlexColumn>
        </li>
    );
};

export const HendelseSkeleton: React.FC = () => {
    return (
        <li className={styles.Hendelse}>
            <div className={styles.IconContainer} />
            <FlexColumn className={styles.Content}>
                <LoadingShimmer style={{ height: 20, marginBottom: 4 }} />
                <LoadingShimmer style={{ height: 20 }} />
            </FlexColumn>
        </li>
    );
};

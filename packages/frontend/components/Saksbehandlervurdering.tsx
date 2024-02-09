import styles from './Vurdering.module.scss';
import classNames from 'classnames';
import React from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';

import { FlexColumn } from './Flex';

const Icon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.719 9.3227L8.48252 12.5585C8.44348 12.5969 8.41596 12.6443 8.4006 12.6968L8.27964 13.1198H0.958681C0.873561 13.1198 0.791641 13.0859 0.732121 13.0257C0.671321 12.9649 0.638041 12.8824 0.638681 12.7973L0.638797 12.7902C0.640986 12.652 0.666786 11.0238 0.974681 10.0939C1.22044 9.35343 2.40828 8.9611 3.91356 8.46446L3.92874 8.45944C4.3227 8.32918 4.72818 8.19511 5.11868 8.0523V6.85934C4.80828 6.65134 4.23548 6.11822 4.16636 4.98542C3.9302 4.83886 3.783 4.52078 3.783 4.11438C3.783 3.89614 3.82908 3.6875 3.91356 3.52622C3.96348 3.43022 4.02812 3.35086 4.10236 3.28942C3.96092 2.80174 3.72348 1.93646 4.15164 1.47182C4.33212 1.27598 4.58876 1.18766 4.919 1.20558C5.2934 0.557904 6.33916 0.319824 7.19868 0.319824C8.16892 0.319824 9.37724 0.623184 9.58908 1.47694C9.76508 2.18222 9.51036 2.86894 9.3542 3.26254C9.54108 3.4315 9.65436 3.72654 9.65436 4.09134C9.65436 4.5067 9.50652 4.8331 9.27228 4.98286C9.2038 6.11758 8.62972 6.65134 8.31868 6.85934V8.0523C8.71484 8.19694 9.12572 8.33262 9.52508 8.46446C10.4076 8.75566 11.1801 9.01166 11.719 9.3227ZM9.27868 12.6673L12.2323 9.71438L12.3468 9.59918L14.3993 11.6517L11.3312 14.7198L9.27868 12.6673ZM8.33148 15.2721C8.29884 15.3841 8.3302 15.5045 8.41276 15.5864C8.47292 15.6472 8.55484 15.6798 8.63868 15.6798C8.66812 15.6798 8.69756 15.676 8.72636 15.6677L10.7859 15.0795L8.91964 13.2133L8.33148 15.2721ZM14.3059 8.09326L15.9059 9.69326C15.9654 9.75278 15.9993 9.83406 15.9993 9.91918C15.9993 10.0043 15.9654 10.0856 15.9059 10.1457L14.8518 11.1992L12.7993 9.1467L13.8534 8.09326C13.9782 7.96846 14.1811 7.96846 14.3059 8.09326Z"
            fill="white"
        />
    </svg>
);

interface SaksbehandlervurderingProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    ident: string;
}

export const Saksbehandlervurdering: React.FC<SaksbehandlervurderingProps> = ({
    className,
    children,
    title,
    ident,
    ...divProps
}) => (
    <div className={classNames(styles.container, styles['container__saksbehandler'], className)} {...divProps}>
        <div className={styles.ikoncontainer}>
            <Icon />
        </div>
        <FlexColumn>
            <Heading as="h2" size="xsmall">
                {title}
            </Heading>
            <BodyShort className={styles.details} as="p" size="small">
                Behandlet av {ident}
            </BodyShort>
        </FlexColumn>
        {children}
    </div>
);

import styles from './Vurdering.module.scss';
import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';

const Icon = (): ReactElement => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.6667 6.66667H13.764C13.6307 6.14 13.4613 5.55533 13.2453 5.112L14.6 3.75733C14.6633 3.69467 14.698 3.60933 14.698 3.52133C14.698 3.43333 14.6627 3.348 14.6 3.28533L12.7133 1.40133C12.5833 1.27067 12.372 1.27067 12.242 1.40133L10.8873 2.75533C10.444 2.53933 9.85933 2.37 9.33333 2.23733V0.333333C9.33333 0.149333 9.184 0 9 0H7C6.81667 0 6.66667 0.149333 6.66667 0.333333V2.23733C6.14067 2.37 5.556 2.53933 5.11267 2.75533L3.758 1.40133C3.62733 1.27067 3.41667 1.27067 3.28667 1.40133L1.40067 3.286C1.27067 3.41533 1.27067 3.62733 1.40067 3.75733L2.756 5.11267C2.54067 5.554 2.37067 6.13933 2.23667 6.66667H0.333333C0.15 6.66667 0 6.816 0 7V9C0 9.184 0.15 9.33333 0.333333 9.33333H2.23667C2.37 9.86067 2.54 10.4453 2.75533 10.8873L1.4 12.2427C1.33733 12.3053 1.30267 12.39 1.30267 12.4787C1.30267 12.5673 1.338 12.652 1.4 12.7147L3.28667 14.6C3.412 14.7253 3.63333 14.7253 3.758 14.6L5.11267 13.2453C5.55467 13.46 6.13933 13.63 6.66667 13.764V15.6667C6.66667 15.8507 6.81667 16 7 16H9C9.184 16 9.33333 15.8507 9.33333 15.6667V13.764C9.86067 13.63 10.4453 13.46 10.8873 13.2453L12.2433 14.6C12.3733 14.73 12.5847 14.73 12.7147 14.6L14.5993 12.7147C14.73 12.5847 14.73 12.3733 14.5993 12.2433L13.2447 10.888C13.46 10.446 13.63 9.86133 13.7633 9.334H15.6667C15.8507 9.334 16 9.18467 16 9.00067V7.00067C16 6.816 15.8507 6.66667 15.6667 6.66667ZM8 10.6667C6.53 10.6667 5.33333 9.47 5.33333 8C5.33333 6.53 6.53 5.33333 8 5.33333C9.47067 5.33333 10.6667 6.53 10.6667 8C10.6667 9.47 9.47067 10.6667 8 10.6667Z"
            fill="white"
        />
    </svg>
);

interface AutomatiskVurderingProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    ident: string;
}

export const AutomatiskVurdering = ({
    children,
    title,
    ident,
    ...divProps
}: AutomatiskVurderingProps): ReactElement => (
    <div className={classNames(styles.container, styles['container__automatisk'])} {...divProps}>
        <div className={styles.iconcontainer}>
            <Icon />
        </div>
        <div className={styles.column}>
            <Heading as="h2" size="xsmall">
                {title}
            </Heading>
            <BodyShort as="p" size="small" className={styles.details}>
                Behandlet av {ident}
            </BodyShort>
        </div>
        {children}
    </div>
);

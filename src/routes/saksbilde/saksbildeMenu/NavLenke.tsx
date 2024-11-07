import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';
import { last } from 'remeda';

import { Box, Skeleton } from '@navikt/ds-react';

import styles from './NavLenke.module.css';

interface NavLenkeProps {
    tittel: string;
    to: string;
}

export const NavLenke = ({ tittel, to }: NavLenkeProps): ReactElement => {
    const tab = last(usePathname().split('/'));
    return (
        <Link
            className={classNames(styles.NavLink, decodeURI(tab ?? '') === to && styles.ActiveLink)}
            href={to}
            title={tittel}
        >
            {tittel}
        </Link>
    );
};

export const NavLenkeSkeleton = ({ tittel }: { tittel: string }) => (
    <Skeleton>
        <Box className={styles.NavLink}>{tittel}</Box>
    </Skeleton>
);

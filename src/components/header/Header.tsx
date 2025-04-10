'use client';

import classNames from 'classnames/bind';
import Link from 'next/link';
import React, { ReactElement } from 'react';

import { InternalHeader } from '@navikt/ds-react';

import { erDev, erLokal, erUtvikling } from '@/env';
import { SystemMenu } from '@components/SystemMenu';
import { UserMenu } from '@components/UserMenu';
import { EasterEgg } from '@components/header/EasterEgg';
import { Personsøk } from '@components/header/Personsøk';
import { Nyheter } from '@components/header/nyheter/Nyheter';
import { ToggleMenyButton } from '@components/header/toggleMeny/ToggleMenyButton';

import styles from './Header.module.css';

const cx = classNames.bind(styles);

export const Header = (): ReactElement => {
    return (
        <InternalHeader className={cx(styles.header, { localhostHeader: erLokal, devHeader: erDev })}>
            <InternalHeader.Title as={Link} href="/" className={styles.Link}>
                Nav Sykepenger
            </InternalHeader.Title>
            <Personsøk />
            <EasterEgg />
            {erUtvikling && <ToggleMenyButton />}
            <Nyheter />
            <SystemMenu />
            <UserMenu />
        </InternalHeader>
    );
};

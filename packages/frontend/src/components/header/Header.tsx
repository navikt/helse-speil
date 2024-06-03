'use client';

import classNames from 'classnames/bind';
import Link from 'next/link';
import React from 'react';

import { InternalHeader } from '@navikt/ds-react';

import { useBrukerGrupper } from '@/auth/brukerContext';
import { erDev, erLokal, erUtvikling } from '@/env';
import { SystemMenu } from '@components/SystemMenu';
import { UserMenu } from '@components/UserMenu';
import { EasterEgg } from '@components/header/EasterEgg';
import { Personsøk } from '@components/header/Personsøk';
import { graphqlplayground } from '@utils/featureToggles';

import { ToggleMenyButton } from './ToggleMeny/ToggleMenyButton';

import styles from './Header.module.css';

const cx = classNames.bind(styles);

export const Header = () => {
    const enablePlayground = graphqlplayground(useBrukerGrupper());

    return (
        <InternalHeader className={cx(styles.header, { localhostHeader: erLokal, devHeader: erDev })}>
            <InternalHeader.Title as={Link} href="/" className={styles.Link}>
                NAV Sykepenger
            </InternalHeader.Title>
            <Personsøk />
            <EasterEgg />
            {erUtvikling && <ToggleMenyButton />}
            {enablePlayground && (
                <InternalHeader.Title as={Link} href="/playground" className={styles.Link}>
                    GraphQL Playground
                </InternalHeader.Title>
            )}
            <SystemMenu />
            <UserMenu />
        </InternalHeader>
    );
};

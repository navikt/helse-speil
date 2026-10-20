'use client';

import classNames from 'classnames/bind';
import NextLink from 'next/link';
import React, { ReactElement } from 'react';

import { InternalHeader } from '@navikt/ds-react';

import { backend, erDev, erUtvikling } from '@/env';
import { SystemMenu } from '@components/SystemMenu';
import { UserMenu } from '@components/UserMenu';
import { EasterEgg } from '@components/header/EasterEgg';
import { Personsøk } from '@components/header/Personsøk';
import { SpoogleSøk } from '@components/header/SpoogleSøk';
import { Nyheter } from '@components/header/nyheter/Nyheter';
import { ToggleMenyButton } from '@components/header/toggleMeny/ToggleMenyButton';
import { useHarUtviklerRolle } from '@hooks/brukerrolleHooks';
import { useUtviklersnacks } from '@state/toggles';

import styles from './Header.module.css';

const cx = classNames.bind(styles);

export const Header = (): ReactElement => {
    const harUtviklerRolle = useHarUtviklerRolle();
    const utviklersnacks = useUtviklersnacks();
    return (
        <InternalHeader
            className={cx(styles.header, {
                localhostHeader: backend !== 'deployed',
                devHeader: erDev,
            })}
        >
            <InternalHeader.Title as={NextLink} href="/">
                Nav Sykepenger
            </InternalHeader.Title>
            <div className={styles.søkefelter}>{utviklersnacks ? <SpoogleSøk /> : <Personsøk />}</div>
            <EasterEgg />
            {(erUtvikling || harUtviklerRolle) && <ToggleMenyButton />}
            <Nyheter />
            <SystemMenu />
            <UserMenu />
        </InternalHeader>
    );
};

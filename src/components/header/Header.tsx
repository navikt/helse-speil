'use client';

import NextLink from 'next/link';
import { ReactElement } from 'react';

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
import { cn } from '@utils/tw';

import styles from './Header.module.css';

export const Header = (): ReactElement => {
    const harUtviklerRolle = useHarUtviklerRolle();
    const utviklersnacks = useUtviklersnacks();
    return (
        <InternalHeader
            className={cn(styles.header, backend !== 'deployed' && styles.localhostHeader, erDev && styles.devHeader)}
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

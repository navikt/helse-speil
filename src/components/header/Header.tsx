'use client';

import classNames from 'classnames/bind';
import Link from 'next/link';
import React, { ReactElement } from 'react';

import { Buildings2Icon } from '@navikt/aksel-icons';
import { InternalHeader, Tooltip } from '@navikt/ds-react';

import { erDev, erLokal, erUtvikling } from '@/env';
import { useBrukerGrupper } from '@auth/brukerContext';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { SystemMenu } from '@components/SystemMenu';
import { UserMenu } from '@components/UserMenu';
import { EasterEgg } from '@components/header/EasterEgg';
import { Personsøk } from '@components/header/Personsøk';
import { Nyheter } from '@components/header/nyheter/Nyheter';
import { ToggleMenyButton } from '@components/header/toggleMeny/ToggleMenyButton';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { erUtviklingEllerErPåTeamBømlo } from '@utils/featureToggles';

import styles from './Header.module.css';

const cx = classNames.bind(styles);

const TestOppslagPåOrganisasjonsnummer = () => {
    const { loading, data, error } = useOrganisasjonQuery('889640782');

    return (
        <Tooltip content={loading ? 'Laster' : (error?.message ?? data?.organisasjon?.navn ?? 'Nothing')}>
            <Buildings2Icon />
        </Tooltip>
    );
};

export const Header = (): ReactElement => {
    const erUtvikler = erUtviklingEllerErPåTeamBømlo(useBrukerGrupper());
    return (
        <InternalHeader className={cx(styles.header, { localhostHeader: erLokal, devHeader: erDev })}>
            <InternalHeader.Title as={Link} href="/" className={styles.Link}>
                Nav Sykepenger
            </InternalHeader.Title>
            <Personsøk />
            <EasterEgg />
            {erUtvikler && (
                <ErrorBoundary fallback={<></>}>
                    <TestOppslagPåOrganisasjonsnummer />
                </ErrorBoundary>
            )}
            {erUtvikling && <ToggleMenyButton />}
            <Nyheter />
            <SystemMenu />
            <UserMenu />
        </InternalHeader>
    );
};

import classNames from 'classnames/bind';
import React from 'react';
import { Link } from 'react-router-dom';

import { Header as InternalHeader } from '@navikt/ds-react-internal';

import { SystemMenu } from '@components/SystemMenu';
import { UserMenu } from '@components/UserMenu';
import { EasterEgg } from '@components/header/EasterEgg';
import { Personsøk } from '@components/header/Personsøk';
import { erDev, erLocal, graphqlplayground, toggleMeny } from '@utils/featureToggles';

import { ToggleMenyButton } from './ToggleMeny/ToggleMenyButton';

import styles from './Header.module.css';

const cx = classNames.bind(styles);

export const Header = () => (
    <InternalHeader className={cx(styles.header, { localhostHeader: erLocal(), devHeader: erDev() })}>
        <InternalHeader.Title as="span">
            <Link to="/" className={styles.Link}>
                NAV Sykepenger
            </Link>
        </InternalHeader.Title>
        <Personsøk />
        <EasterEgg />
        {toggleMeny && <ToggleMenyButton />}
        {graphqlplayground && (
            <InternalHeader.Title as="span">
                <Link to="/playground" className={styles.Link}>
                    GraphQL Playground
                </Link>
            </InternalHeader.Title>
        )}
        <SystemMenu />
        <UserMenu />
    </InternalHeader>
);

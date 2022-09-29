import React from 'react';
import { Link } from 'react-router-dom';
import { Header as InternalHeader } from '@navikt/ds-react-internal';

import { graphqlplayground, toggleMeny } from '@utils/featureToggles';
import { SystemMenu } from '@components/SystemMenu';
import { Personsøk } from '@components/header/Personsøk';
import { UserMenu } from '@components/UserMenu';

import { ToggleMenyButton } from './ToggleMeny/ToggleMenyButton';
import { EasterEgg } from '../../EasterEgg';

import styles from './Header.module.css';

export const Header = () => {
    return (
        <InternalHeader className={styles.Header}>
            <InternalHeader.Title as="h1">
                <Link to="/" className={styles.Link}>
                    NAV Sykepenger
                </Link>
            </InternalHeader.Title>
            <Personsøk />
            <EasterEgg />
            {toggleMeny && <ToggleMenyButton />}
            {graphqlplayground && (
                <InternalHeader.Title as="h1">
                    <Link to="/playground" className={styles.Link}>
                        GraphQL Playground
                    </Link>
                </InternalHeader.Title>
            )}
            <SystemMenu />
            <UserMenu />
        </InternalHeader>
    );
};

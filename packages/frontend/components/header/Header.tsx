import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Header as InternalHeader } from '@navikt/ds-react-internal';

import { authState } from '@state/authentication';
import { SystemMenu } from '@components/SystemMenu';
import { Personsøk } from '@components/header/Personsøk';
import { UserMenu } from '@components/UserMenu';
import { graphqlplayground, toggleMeny } from '@utils/featureToggles';

import { ToggleMenyButton } from './ToggleMeny/ToggleMenyButton';
import { EasterEgg } from '../../EasterEgg';

import styles from './Header.module.css';

const useBrukerinfo = () => {
    const { name, ident, isLoggedIn } = useRecoilValue(authState);
    return isLoggedIn ? { navn: name, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' };
};

export const Header = () => {
    const brukerinfo = useBrukerinfo();

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
            <UserMenu navn={brukerinfo.navn} ident={brukerinfo.ident} />
        </InternalHeader>
    );
};

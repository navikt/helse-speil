import React from 'react';
import { BodyShort } from '@navikt/ds-react';
import { Dropdown, Header } from '@navikt/ds-react-internal';

import { useIsAnonymous, useToggleAnonymity } from '@state/anonymization';

import styles from './UserMenu.module.css';

interface UserMenuProps {
    ident: string;
    navn: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ navn, ident }) => {
    const isAnonymous = useIsAnonymous();
    const toggleAnonymity = useToggleAnonymity();

    return (
        <Dropdown>
            <Header.UserButton name={navn} description={ident} as={Dropdown.Toggle} />
            <Dropdown.Menu className={styles.UserMenu}>
                <Dropdown.Menu.List>
                    <BodyShort className={styles.MenuItem}>
                        {navn}
                        <br />
                        {ident}
                    </BodyShort>
                    <Dropdown.Menu.Divider />
                    <Dropdown.Menu.List.Item className={styles.MenuItem} onClick={toggleAnonymity}>
                        {isAnonymous ? 'Fjern anonymisering' : 'Anonymiser personopplysninger'}
                    </Dropdown.Menu.List.Item>
                    <Dropdown.Menu.Divider />
                    <Dropdown.Menu.List.Item as="a" href="/logout" className={styles.MenuItem}>
                        Logg ut
                    </Dropdown.Menu.List.Item>
                </Dropdown.Menu.List>
            </Dropdown.Menu>
        </Dropdown>
    );
};

import React, { useState } from 'react';
import { BodyShort } from '@navikt/ds-react';
import { Dropdown, Header } from '@navikt/ds-react-internal';

import styles from './UserMenu.module.css';

interface UserMenuProps {
    ident: string;
    navn: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ navn, ident }) => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const toggleAnchor = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        anchor ? setAnchor(null) : setAnchor(event.currentTarget);
    };

    return (
        <Dropdown>
            <Header.UserButton name={navn} description={ident} as={Dropdown.Toggle} />
            <Dropdown.Menu>
                <Dropdown.Menu.List>
                    <BodyShort className={styles.MenuItem}>
                        {navn}
                        <br />
                        {ident}
                    </BodyShort>
                    <hr className={styles.Divider} />
                    <Dropdown.Menu.List.Item as="a" href="/logout" className={styles.MenuItem}>
                        Logg ut
                    </Dropdown.Menu.List.Item>
                </Dropdown.Menu.List>
            </Dropdown.Menu>
        </Dropdown>
    );
};

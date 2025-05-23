import React, { ReactElement, useState } from 'react';

import { BodyShort, Dropdown, InternalHeader as Header } from '@navikt/ds-react';

import { TastaturModal } from '@components/TastaturModal';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { useIsAnonymous, useToggleAnonymity } from '@state/anonymization';
import { useInnloggetSaksbehandler } from '@state/authentication';

import styles from './UserMenu.module.css';

const useBrukerinfo = () => {
    const { navn, ident, isLoggedIn } = useInnloggetSaksbehandler();
    return isLoggedIn ? { navn, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' };
};

export const UserMenu = (): ReactElement => {
    const { navn, ident } = useBrukerinfo();
    const isAnonymous = useIsAnonymous();
    const toggleAnonymity = useToggleAnonymity();
    const [visTastatursnarveier, setVisTastatursnarveier] = useState(false);

    useKeyboard([
        {
            key: Key.F1,
            action: () => setVisTastatursnarveier(!visTastatursnarveier),
            ignoreIfModifiers: false,
        },
    ]);

    return (
        <>
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
                        <Dropdown.Menu.List.Item
                            as="a"
                            className={styles.MenuItem}
                            onClick={() => setVisTastatursnarveier(!visTastatursnarveier)}
                        >
                            Tastatursnarveier
                        </Dropdown.Menu.List.Item>
                        <Dropdown.Menu.Divider />
                        <Dropdown.Menu.List.Item as="a" href="/oauth2/logout" className={styles.MenuItem}>
                            Logg ut
                        </Dropdown.Menu.List.Item>
                    </Dropdown.Menu.List>
                </Dropdown.Menu>
            </Dropdown>
            {visTastatursnarveier && (
                <TastaturModal closeModal={() => setVisTastatursnarveier(false)} showModal={visTastatursnarveier} />
            )}
        </>
    );
};

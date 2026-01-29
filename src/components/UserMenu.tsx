import React, { ReactElement, useState } from 'react';

import { ActionMenu, BodyShort, VStack } from '@navikt/ds-react';
import { InternalHeaderUserButton } from '@navikt/ds-react/InternalHeader';

import { DarkModeToggle } from '@components/DarkModeToggle';
import { TastaturModal } from '@components/TastaturModal';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { useIsAnonymous, useToggleAnonymity } from '@state/anonymization';
import { useInnloggetSaksbehandler } from '@state/authentication';

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
            <ActionMenu>
                <ActionMenu.Trigger>
                    <InternalHeaderUserButton name={navn} description={ident} />
                </ActionMenu.Trigger>
                <ActionMenu.Content>
                    <VStack paddingInline="space-8">
                        <BodyShort>{navn}</BodyShort>
                        <BodyShort>{ident}</BodyShort>
                    </VStack>
                    <ActionMenu.Divider />
                    <ActionMenu.Item onClick={toggleAnonymity}>
                        {isAnonymous ? 'Fjern anonymisering' : 'Anonymiser personopplysninger'}
                    </ActionMenu.Item>
                    <ActionMenu.Divider />
                    <ActionMenu.Item onClick={() => setVisTastatursnarveier(!visTastatursnarveier)}>
                        Tastatursnarveier
                    </ActionMenu.Item>
                    <ActionMenu.Divider />
                    <DarkModeToggle />
                    <ActionMenu.Divider />
                    <ActionMenu.Item as="a" href="/oauth2/logout">
                        Logg ut
                    </ActionMenu.Item>
                </ActionMenu.Content>
            </ActionMenu>
            {/*<Dropdown>*/}
            {/*    <Header.UserButton name={navn} description={ident} as={Dropdown.Toggle} />*/}
            {/*    <Dropdown.Menu className={styles.UserMenu}>*/}
            {/*        <Dropdown.Menu.List>*/}
            {/*            <BodyShort className={styles.MenuItem}>*/}
            {/*                {navn}*/}
            {/*                <br />*/}
            {/*                {ident}*/}
            {/*            </BodyShort>*/}
            {/*            <Dropdown.Menu.Divider />*/}
            {/*            <Dropdown.Menu.List.Item className={styles.MenuItem} onClick={toggleAnonymity}>*/}
            {/*                {isAnonymous ? 'Fjern anonymisering' : 'Anonymiser personopplysninger'}*/}
            {/*            </Dropdown.Menu.List.Item>*/}
            {/*            <Dropdown.Menu.Divider />*/}
            {/*            <Dropdown.Menu.List.Item*/}
            {/*                as="a"*/}
            {/*                className={styles.MenuItem}*/}
            {/*                onClick={() => setVisTastatursnarveier(!visTastatursnarveier)}*/}
            {/*            >*/}
            {/*                Tastatursnarveier*/}
            {/*            </Dropdown.Menu.List.Item>*/}
            {/*            <Dropdown.Menu.Divider />*/}
            {/*            <DarkModeToggle />*/}
            {/*            <Dropdown.Menu.Divider />*/}
            {/*            <Dropdown.Menu.List.Item as="a" href="/oauth2/logout" className={styles.MenuItem}>*/}
            {/*                Logg ut*/}
            {/*            </Dropdown.Menu.List.Item>*/}
            {/*        </Dropdown.Menu.List>*/}
            {/*    </Dropdown.Menu>*/}
            {/*</Dropdown>*/}
            {visTastatursnarveier && (
                <TastaturModal closeModal={() => setVisTastatursnarveier(false)} showModal={visTastatursnarveier} />
            )}
        </>
    );
};

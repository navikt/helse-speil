import React, { ReactElement, useState } from 'react';

import { Buildings2Icon } from '@navikt/aksel-icons';
import { BodyShort, Dropdown, ErrorMessage, HStack, InternalHeader as Header, Skeleton } from '@navikt/ds-react';

import { useBrukerGrupper } from '@auth/brukerContext';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { TastaturModal } from '@components/TastaturModal';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { useIsAnonymous, useToggleAnonymity } from '@state/anonymization';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { erUtviklingEllerErPåTeamBømlo } from '@utils/featureToggles';

import styles from './UserMenu.module.css';

const useBrukerinfo = () => {
    const { navn, ident, isLoggedIn } = useInnloggetSaksbehandler();
    return isLoggedIn ? { navn, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' };
};

const TestOppslagPåOrganisasjonsnummer = () => {
    const { loading, data, error } = useOrganisasjonQuery('889640782');

    return loading ? (
        <Skeleton />
    ) : error ? (
        <ErrorMessage>{error.message}</ErrorMessage>
    ) : data?.organisasjon?.navn ? (
        <BodyShort>{data.organisasjon.navn}</BodyShort>
    ) : (
        <ErrorMessage>Fant ikke organisasjon</ErrorMessage>
    );
};

export const UserMenu = (): ReactElement => {
    const { navn, ident } = useBrukerinfo();
    const erUtvikler = erUtviklingEllerErPåTeamBømlo(useBrukerGrupper());
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
                        {erUtvikler && (
                            <HStack gap="2" align="center" className={styles.MenuItem}>
                                <Buildings2Icon />
                                <ErrorBoundary fallback={<ErrorMessage>Overordnet feil</ErrorMessage>}>
                                    <TestOppslagPåOrganisasjonsnummer />
                                </ErrorBoundary>
                            </HStack>
                        )}
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

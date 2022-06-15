import React, { FormEvent, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Search } from '@navikt/ds-react';
import { Header as InternalHeader } from '@navikt/ds-react-internal';

import { authState } from '@state/authentication';
import { useToggleEasterEgg } from '@state/easterEgg';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { useFetchPerson, usePersonLoadable } from '@state/person';
import { erGyldigPersonId } from '@hooks/useRefreshPersonVedUrlEndring';
import { UserMenu } from '@components/UserMenu';
import { SystemMenu } from '@components/SystemMenu';
import { isPerson } from '@utils/typeguards';
import { graphqlplayground, toggleMeny } from '@utils/featureToggles';

import { EasterEgg } from '../../EasterEgg';

import styles from './Header.module.css';
import { ToggleMenyButton } from '@components/header/ToggleMeny/ToggleMenyButton';

const useNavigateOnFetch = () => {
    const person = usePersonLoadable();
    const history = useHistory();
    const addVarsel = useAddVarsel();
    const hasFetched = useRef(false);

    const hasFetchedSuccessfully = () => {
        return hasFetched.current && person.state === 'hasValue' && isPerson(person.contents);
    };

    const hasFetchedWithNoPersonInResult = () => {
        return hasFetched.current && person.state !== 'loading' && !isPerson(person.contents);
    };

    useEffect(() => {
        if (hasFetchedSuccessfully()) {
            hasFetched.current = false;
            history.push(`/person/${person.contents.aktorId}/utbetaling`);
        } else if (hasFetchedWithNoPersonInResult()) {
            addVarsel({
                key: 'ugyldig-søk',
                message: 'Personen har ingen perioder til godkjenning eller tidligere utbetalinger i Speil',
                type: 'info',
            });
        }
    }, [person, hasFetched]);

    return hasFetched;
};

export const Header = () => {
    const fetchPerson = useFetchPerson();
    const removeVarsel = useRemoveVarsel();
    const addVarsel = useAddVarsel();
    const hasFetched = useNavigateOnFetch();

    const toggleEasterEgg = useToggleEasterEgg();

    const { name, ident, isLoggedIn } = useRecoilValue(authState);
    const searchRef = useRef<HTMLInputElement>(null);

    const brukerinfo = isLoggedIn ? { navn: name, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' };

    const onSøk = (event: FormEvent) => {
        event.preventDefault();
        removeVarsel('ugyldig-søk');
        const personId = searchRef.current?.value;

        if (!personId) {
            return;
        }

        if (personId.toLowerCase() === 'agurk') {
            toggleEasterEgg('Agurk');
            return;
        }

        if (!erGyldigPersonId(personId)) {
            addVarsel({
                key: 'ugyldig-søk',
                message: `"${personId}" er ikke en gyldig aktør-ID/fødselsnummer.`,
                type: 'feil',
            });
        } else {
            hasFetched.current = true;
            fetchPerson(personId);
        }
    };

    return (
        <InternalHeader className={styles.Header}>
            <InternalHeader.Title as="h1">
                <Link to="/" className={styles.Link}>
                    NAV Sykepenger
                </Link>
            </InternalHeader.Title>
            <form className={styles.SearchForm} onSubmit={onSøk}>
                <Search label="Søk" size="small" variant="secondary" placeholder="Søk" ref={searchRef} />
            </form>
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

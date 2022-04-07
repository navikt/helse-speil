import styled from '@emotion/styled';
import React, { useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { InternalHeader, InternalHeaderTitle } from '@navikt/ds-react';

import { erGyldigPersonId } from '@hooks/useRefreshPersonVedUrlEndring';
import { authState } from '@state/authentication';
import { useToggleEasterEgg } from '@state/easterEgg';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { BentoMeny } from '@components/BentoMeny';
import { Brukermeny } from '@components/Brukermeny';

import { SearchBar } from './SearchBar';
import { EasterEgg } from '../../EasterEgg';
import { graphqlplayground } from '@utils/featureToggles';
import { useFetchPerson, usePersonLoadable } from '@state/person';
import { isPerson } from '@utils/typeguards';

const Container = styled.div`
    flex-shrink: 0;
    width: 100%;

    > header {
        max-width: unset;
        box-sizing: border-box;
        min-width: var(--speil-total-min-width);
        max-height: 50px;
    }

    input {
        margin-left: 1.5rem;
    }

    .navds-header__title > span > a:focus {
        box-shadow: none;
    }

    .navds-header__title > span > a:focus-visible {
        box-shadow: var(--navds-shadow-focus-on-dark);
        outline: none;
    }
`;

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

    const brukerinfo = isLoggedIn ? { navn: name, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' };

    const onSøk = (personId: string) => {
        if (personId.toLowerCase() === 'agurk') {
            toggleEasterEgg('Agurk');
            return Promise.resolve();
        }
        const key = 'ugyldig-søk';
        removeVarsel(key);
        if (!erGyldigPersonId(personId)) {
            addVarsel({
                key: key,
                message: `"${personId}" er ikke en gyldig aktør-ID/fødselsnummer.`,
                type: 'feil',
            });
        } else {
            hasFetched.current = true;
            fetchPerson(personId);
        }
        return Promise.resolve();
    };

    return (
        <Container>
            <InternalHeader>
                <InternalHeaderTitle>
                    <Link to="/">NAV Sykepenger</Link>
                </InternalHeaderTitle>
                <SearchBar onSearch={onSøk} />
                <EasterEgg />
                {graphqlplayground && (
                    <InternalHeaderTitle>
                        <Link to="/playground">GraphQL Playground</Link>
                    </InternalHeaderTitle>
                )}
                <BentoMeny />
                <Brukermeny navn={brukerinfo.navn} ident={brukerinfo.ident} />
            </InternalHeader>
        </Container>
    );
};

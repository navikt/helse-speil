import styled from '@emotion/styled';
import React from 'react';
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
import { useFetchPerson } from '@state/person';

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

export const Header = () => {
    const history = useHistory();
    const fetchPerson = useFetchPerson();
    const removeVarsel = useRemoveVarsel();
    const addVarsel = useAddVarsel();

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
            fetchPerson(personId);
            // Håndter dette i personState
            // .then(
            //     (res: { person?: Person }) => res.person && history.push(`/person/${res.person.aktørId}/utbetaling`)
            // )
            // .catch((error) =>
            //     addVarsel({
            //         key: key,
            //         message: error.message,
            //         type: error.type,
            //     })
            // );
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

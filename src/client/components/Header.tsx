import React from 'react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/authentication';
import { Søk } from '@navikt/helse-frontend-header';
import '@navikt/helse-frontend-header/lib/main.css';
import { Link, useHistory } from 'react-router-dom';
import { erGyldigPersonId } from '../hooks/useRefreshPersonVedUrlEndring';
import { useAddVarsel, useRemoveVarsel } from '../state/varsler';
import { Varseltype } from '@navikt/helse-frontend-varsel';
import { InternalHeader, InternalHeaderTitle } from '@navikt/ds-react';
import { useHentPerson } from '../state/person';
import { Person } from 'internal-types';
import EasterEgg from '../EasterEgg';
import { BentoMeny } from './BentoMeny';
import Brukermeny from './Brukermeny';
import '@navikt/ds-css';

const Container = styled.div`
    flex-shrink: 0;
    width: 100%;

    > header {
        max-width: unset;
        box-sizing: border-box;
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
    const hentPerson = useHentPerson();
    const removeVarsel = useRemoveVarsel();
    const addVarsel = useAddVarsel();

    const { name, ident, isLoggedIn } = useRecoilValue(authState);

    const brukerinfo = isLoggedIn ? { navn: name, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' };

    const onSøk = (personId: string) => {
        const key = 'ugyldig-søk';
        removeVarsel(key);
        if (!erGyldigPersonId(personId)) {
            addVarsel({
                key: key,
                message: `"${personId}" er ikke en gyldig aktør-ID/fødselsnummer.`,
                type: Varseltype.Feil,
            });
        } else {
            hentPerson(personId)
                .then(
                    (res: { person?: Person }) => res.person && history.push(`/person/${res.person.aktørId}/utbetaling`)
                )
                .catch((err) =>
                    addVarsel({
                        key: key,
                        message: err.message,
                        type: Varseltype.Feil,
                    })
                );
        }
        return Promise.resolve();
    };

    return (
        <Container>
            <InternalHeader>
                <InternalHeaderTitle>
                    <Link to="/">NAV Sykepenger</Link>
                </InternalHeaderTitle>
                <Søk onSøk={onSøk} />
                <EasterEgg />
                <BentoMeny />
                <Brukermeny navn={brukerinfo.navn} ident={brukerinfo.ident} />
            </InternalHeader>
        </Container>
    );
};

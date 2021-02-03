import React from 'react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/authentication';
import { Søk } from '@navikt/helse-frontend-header';
import '@navikt/helse-frontend-header/lib/main.css';
import { Link, useHistory } from 'react-router-dom';
import { erGyldigPersonId } from '../hooks/useRefreshPersonVedUrlEndring';
import { Scopes, useUpdateVarsler } from '../state/varslerState';
import { Varseltype } from '@navikt/helse-frontend-varsel';
import { InternalHeader, InternalHeaderTitle, InternalHeaderUser } from '@navikt/ds-react';
import { useHentPerson } from '../state/person';
import { Person } from 'internal-types';

const Container = styled.div`
    flex-shrink: 0;
    height: max-content;
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
    const { leggTilVarsel, fjernVarsler } = useUpdateVarsler();
    const { name, ident, isLoggedIn } = useRecoilValue(authState);
    const history = useHistory();
    const hentPerson = useHentPerson();

    const brukerinfo = isLoggedIn ? { navn: name, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' };

    const onSøk = (personId: string) => {
        fjernVarsler();
        if (!erGyldigPersonId(personId)) {
            leggTilVarsel({
                message: `"${personId}" er verken en gyldig aktør-ID/fødselsnummer.`,
                scope: Scopes.GLOBAL,
                type: Varseltype.Feil,
            });
        } else {
            hentPerson(personId).then(
                (res: { person?: Person }) => res.person && history.push(`/person/${res.person.aktørId}/utbetaling`)
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
                <InternalHeaderUser name={brukerinfo.navn} ident={brukerinfo.ident} />
            </InternalHeader>
        </Container>
    );
};

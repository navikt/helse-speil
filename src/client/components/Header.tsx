import React from 'react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/authentication';
import { HeaderEnkel, Søk } from '@navikt/helse-frontend-header';
import '@navikt/helse-frontend-header/lib/main.css';
import { Link, useHistory } from 'react-router-dom';
import { erGyldigPersonId } from '../hooks/useRefreshPerson';

const Container = styled.div`
    flex-shrink: 0;
    height: max-content;
    width: 100%;

    > header {
        max-width: unset;
        box-sizing: border-box;
    }
`;

export const Header = () => {
    const { name, ident, isLoggedIn } = useRecoilValue(authState);
    const history = useHistory();

    const brukerinfo = isLoggedIn ? { navn: name, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' };

    const onSøk = (personId: string) => {
        return erGyldigPersonId(personId)
            ? Promise.resolve(history.push(`/person/${personId}/utbetaling`))
            : Promise.reject('Oppgitt verdi er ikke en gyldig aktør-ID eller et gyldig fødselsnummer.');
    };

    return (
        <Container>
            <HeaderEnkel tittel={<Link to="/">NAV Sykepenger</Link>} brukerinfo={brukerinfo}>
                <Søk onSøk={onSøk} />
            </HeaderEnkel>
        </Container>
    );
};

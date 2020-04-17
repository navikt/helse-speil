import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { AuthContext } from '../../context/AuthContext';
import { PersonContext } from '../../context/PersonContext';
import { HeaderEnkel, Søk } from '@navikt/helse-frontend-header';
import { useNavigateAfterSearch } from './useNavigateAfterSearch';

const Container = styled.div`
    flex-shrink: 0;
    height: max-content;
    width: 100%;

    > div {
        max-width: 100%;
    }
`;

const Header = () => {
    const { authInfo } = useContext(AuthContext);
    const { hentPerson } = useContext(PersonContext);
    const { setShouldNavigate } = useNavigateAfterSearch();
    const { name, ident, isLoggedIn } = authInfo;

    const brukerinfo = isLoggedIn ? { navn: name, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' };

    const onSøk = (value: string) => {
        hentPerson(value).then(() => {
            setShouldNavigate(true);
        });
    };

    return (
        <Container>
            <HeaderEnkel tittel="NAV Sykepenger" brukerinfo={brukerinfo}>
                <Søk onSøk={onSøk} />
            </HeaderEnkel>
        </Container>
    );
};

export default Header;

import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { HeaderEnkel as Header, Søk } from '@navikt/helse-frontend-header';
import styled from '@emotion/styled';
import { PersonContext } from '../../context/PersonContext';
import { useNavigateAfterSearch } from './useNavigateAfterSearch';

const Container = styled.div`
    flex-shrink: 0;
    height: max-content;
    width: 100%;

    > div {
        max-width: 100%;
    }
`;

const HeaderBar = () => {
    const { authInfo } = useContext(AuthContext);
    const { hentPerson } = useContext(PersonContext);
    const { setShouldNavigate } = useNavigateAfterSearch();
    const { name, ident, isLoggedIn } = authInfo;

    const brukerinfo = isLoggedIn
        ? { navn: name, ident: ident ?? '' }
        : { navn: 'Ikke pålogget', ident: '' };

    const onSøk = (value: string) => {
        hentPerson(value).then(() => {
            setShouldNavigate(true);
        });
    };

    return (
        <Container>
            <Header tittel="NAV Sykepenger" brukerinfo={brukerinfo}>
                <Søk onSøk={onSøk} />
            </Header>
        </Container>
    );
};

export default HeaderBar;

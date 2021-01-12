import React from 'react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/authentication';
import { HeaderEnkel, Søk } from '@navikt/helse-frontend-header';
import '@navikt/helse-frontend-header/lib/main.css';
import { Link, useHistory } from 'react-router-dom';
import { erGyldigPersonId } from '../hooks/useRefreshPerson';
import { Scopes, useUpdateVarsler } from '../state/varslerState';
import { Varseltype } from '@navikt/helse-frontend-varsel';

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
    const { leggTilVarsel, fjernVarsler } = useUpdateVarsler();
    const { name, ident, isLoggedIn } = useRecoilValue(authState);
    const history = useHistory();

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
            history.push(`/person/${personId}/utbetaling`);
        }
        return Promise.resolve();
    };

    return (
        <Container>
            <HeaderEnkel tittel={<Link to="/">NAV Sykepenger</Link>} brukerinfo={brukerinfo}>
                <Søk onSøk={onSøk} />
            </HeaderEnkel>
        </Container>
    );
};

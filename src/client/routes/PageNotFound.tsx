import styled from '@emotion/styled';
import React from 'react';

import Lenke from 'nav-frontend-lenker';

import { BodyShort, Title } from '@navikt/ds-react';

import nissemyra from '../assets/nissemyra.svg';
import { FlexColumn } from '../components/Flex';

const Container = styled.div`
    display: flex;
    align-items: center;
    margin: 4.5rem 5rem;
`;

const TekstContainer = styled(FlexColumn)`
    margin-right: 3rem;
`;

const Tekst = styled(Title)`
    font-size: 2.5rem;
    line-height: 2.75rem;
`;

const Feilkodetekst = styled(BodyShort)`
    font-weight: 600;
    line-height: 1.5rem;
    margin-bottom: 1rem;
`;

const Oppgavelenke = styled(Lenke)`
    color: var(--navds-color-text-primary);
    font-weight: 600;
    line-height: 1.5rem;
    margin-top: 1.5rem;
    width: max-content;
`;

export const PageNotFound = () => {
    return (
        <Container>
            <TekstContainer>
                <Feilkodetekst component="p">Feilkode: 404</Feilkodetekst>
                <Tekst component="h2" size="m">
                    Oooops!
                </Tekst>
                <Tekst component="h2" size="m">
                    Nå havna vi langt ut i nissemyra
                </Tekst>
                <Oppgavelenke href="/">Til oppgavelista</Oppgavelenke>
            </TekstContainer>
            <img alt="Agurk med armer og bein ikledd en lue som leser et kart" src={nissemyra} />
        </Container>
    );
};

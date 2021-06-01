import styled from '@emotion/styled';
import React from 'react';

import agurk from '../../assets/ingen-oppgaver-agurk.png';
import brevkasse from '../../assets/ingen-oppgaver.png';

import { Tittel } from '../saksbilde/vilkår/vilkårstitler';
import { useAktivTab } from './tabs';

const Container = styled.div`
    align-self: flex-start;
    width: max-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem;
`;

const Tekst = styled(Tittel)`
    margin: 2rem 0 0;
    font-size: 1.25rem;
    flex: 1;
`;

export const IngenOppgaver = () => {
    const aktivTab = useAktivTab();

    switch (aktivTab) {
        case 'alle':
            return (
                <Container>
                    <img alt="Agurk med armer og bein som holder kaffekopp" src={agurk} />
                    <Tekst>Ooops! Ingen saker å plukke...</Tekst>
                </Container>
            );
        case 'mine':
            return (
                <Container>
                    <img alt="Tom brevkasse som smiler" src={brevkasse} />
                    <Tekst>Du har ingen tildelte saker</Tekst>
                </Container>
            );
        case 'ventende':
            return (
                <Container>
                    <img alt="Tom brevkasse som smiler" src={brevkasse} />
                    <Tekst>Du har ingen saker på vent</Tekst>
                </Container>
            );
    }
};

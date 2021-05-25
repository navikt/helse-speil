import styled from '@emotion/styled';
import React from 'react';

import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';

const Feiltekst = styled.div`
    padding-top: 2rem;
    * {
        padding: 1rem;
    }
`;

const KomiskSans = styled.pre`
    font-family: 'Comic Sans MS';
`;

const Agurktekst = styled.p`
    display: flex;
    align-items: center;
    &:before,
    &:after {
        content: '🥒';
        font-size: 55px;
    }
    &:after {
        margin-left: 1.5rem;
    }
    &:before {
        margin-right: 1.5rem;
    }
`;

export const GlobalFeilside = (error: Error) => (
    <>
        <Varsel type={Varseltype.Advarsel}>Siden kan dessverre ikke vises</Varsel>
        <Feiltekst>
            <Agurktekst>
                Du kan forsøke å laste siden på nytt, eller lukke nettleservinduet og logge inn på nytt.
            </Agurktekst>
            <KomiskSans>{error.stack}</KomiskSans>
        </Feiltekst>
    </>
);

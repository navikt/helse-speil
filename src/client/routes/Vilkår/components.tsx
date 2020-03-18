import styled from '@emotion/styled';
// @ts-ignore
import Icon from 'nav-frontend-ikoner-assets';
import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { Paragraf } from './Vilkårsgruppe/Vilkårsgruppe';

export const Ikon = styled(Icon)`
    grid-area: ikon;
`;

export const Vilkårsoverskrift = styled.div`
    display: flex;
    align-items: center;
    margin: 1.5rem 0 1rem 0;
    > *:not(:last-child) {
        margin-right: 1rem;
    }
`;

export const Tittel = styled(Undertittel)`
    font-size: 20px;
    color: #3e3832;
`;

export const Deloverskrift = ({ tittel, ikon, paragraf }: { tittel: string; ikon?: object; paragraf?: string }) => (
    <Vilkårsoverskrift>
        {ikon}
        <Tittel>{tittel}</Tittel>
        {paragraf && <Paragraf>${paragraf}</Paragraf>}
    </Vilkårsoverskrift>
);

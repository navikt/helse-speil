import React, { ReactNode } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import styled from '@emotion/styled';

interface Props {
    label: string;
    children: ReactNode | ReactNode[];
}

const Navn = styled(Normaltekst)`
    min-width: 15rem;
`;

const Verdi = styled.div`
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    font-size: 1rem;
    color: #3e3832;
    text-align: left;
    min-width: 100px;
`;

export const Vilkårsgrupperad = ({ label, children }: Props) => (
    <>
        <Navn>{label}</Navn>
        <Verdi>{children}</Verdi>
    </>
);

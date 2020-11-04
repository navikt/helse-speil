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

const Verdi = styled(Normaltekst)`
    text-align: left;
`;

export const Vilkårsgrupperad = ({ label, children }: Props) => (
    <>
        <Navn>{label}</Navn>
        <Verdi>{children}</Verdi>
    </>
);

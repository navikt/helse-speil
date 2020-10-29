import React, { ReactNode } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import styled from '@emotion/styled';

interface Props {
    label: string;
    bold?: boolean;
    children: ReactNode | ReactNode[];
}

interface NavnProps {
    bold?: string;
}

const Navn = styled(Normaltekst)`
    min-width: 15rem;
    ${(props: NavnProps) => props.bold && 'font-weight: 600;'}
`;

const Verdi = styled(Normaltekst)`
    text-align: left;
`;

export const Vilkårsgrupperad = ({ label, bold = false, children }: Props) => (
    <>
        <Navn bold={`${bold}`}>{label}</Navn>
        <Verdi>{children}</Verdi>
    </>
);

import React, { ReactNode } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import styled from '@emotion/styled';

interface Props {
    label: string;
    children: ReactNode | ReactNode[];
}

const Navn = styled(Normaltekst)`
    min-width: max-content;
`;

const Verdi = styled(Normaltekst)`
    text-align: right;
`;

const Vilkårsgrupperad = ({ label, children }: Props) => (
    <>
        <Navn>{label}</Navn>
        <Verdi>{children}</Verdi>
    </>
);

export default Vilkårsgrupperad;

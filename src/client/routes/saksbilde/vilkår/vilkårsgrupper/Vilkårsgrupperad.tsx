import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

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
    color: var(--navds-color-text-primary);
    text-align: left;
    min-width: 100px;
`;

export const Vilkårsgrupperad = ({ label, children }: Props) => (
    <>
        <Navn>{label}</Navn>
        <Verdi>{children}</Verdi>
    </>
);

import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

interface Props {
    label: string;
    children: ReactNode | ReactNode[];
}

const Navn = styled(BodyShort)`
    min-width: 15rem;
`;

const Verdi = styled.div`
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    font-size: 1rem;
    color: var(--a-text-default);
    text-align: left;
    min-width: 100px;
`;

export const Vilkårsgrupperad = ({ label, children }: Props) => (
    <>
        <Navn as="p">{label}</Navn>
        <Verdi>{children}</Verdi>
    </>
);

import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { IkonContainer } from './Vilkår.styles';

const Container = styled.div`
    display: flex;
    align-items: start;
    margin-bottom: 2rem;
`;

interface VilkårskategoriProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode | ReactNode[];
    ikon: ReactNode;
}

export const Vilkårskategori = ({ children, ikon, ...rest }: VilkårskategoriProps) => (
    <Container className="vilkårskategori" {...rest}>
        <IkonContainer>{ikon}</IkonContainer>
        <BodyShort>{children}</BodyShort>
    </Container>
);

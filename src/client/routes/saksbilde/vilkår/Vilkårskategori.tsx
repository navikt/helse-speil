import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { Flex } from '../../../components/Flex';

import { IkonContainer } from './Vilkår.styles';

const Container = styled(Flex)`
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
        <Normaltekst>{children}</Normaltekst>
    </Container>
);

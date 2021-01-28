import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { FlexColumn } from '../../../components/Flex';
import { Element, Normaltekst } from 'nav-frontend-typografi';

const Container = styled(FlexColumn)`
    margin: 0.5rem 0;

    &:not(:last-of-type) {
        margin-bottom: 1rem;
    }
`;

const Tittel = styled(Element)`
    color: #3e3832;
`;

interface VarselseksjonProps {
    tittel: ReactNode;
}

export const Varselseksjon: React.FC<VarselseksjonProps> = ({ tittel, children }) => (
    <Container>
        <Tittel>{tittel}</Tittel>
        <Normaltekst>{children}</Normaltekst>
    </Container>
);

import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import { BodyLong } from '@navikt/ds-react';

import { FlexColumn } from '@components/Flex';

const Container = styled(FlexColumn)`
    padding: 0.5rem 0;
    max-width: 120ch;

    &:not(:last-of-type) {
        margin-bottom: 1rem;
    }
`;

const Tittel = styled(BodyLong)`
    font-weight: 600;
`;

interface VarselseksjonProps extends ChildrenProps {
    tittel: ReactNode;
}

export const Varselseksjon: React.FC<VarselseksjonProps> = ({ tittel, children }) => (
    <Container>
        <Tittel as="p">{tittel}</Tittel>
        <BodyLong as="pre">{children}</BodyLong>
    </Container>
);

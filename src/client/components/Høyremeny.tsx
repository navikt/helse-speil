import React from 'react';
import styled from '@emotion/styled';
import { Loggvisning } from '@navikt/helse-frontend-logg';

const Container = styled.div`
    flex: 1;
    width: 314px;
    max-width: 314px;
    border-left: 1px solid #c6c2bf;

    > ul {
        border-top: none;
    }
`;

const Høyremeny = () => (
    <Container>
        <Loggvisning />
    </Container>
);

export default Høyremeny;

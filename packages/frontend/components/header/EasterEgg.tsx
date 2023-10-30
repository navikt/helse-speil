import styled from '@emotion/styled';
import React from 'react';

import { Pumpkin } from '@components/header/Pumpkin';

const Container = styled.div`
    display: flex;
    flex-grow: 1;
    margin-left: 1em;
    align-self: center;
`;

export const EasterEgg = () => (
    <Container>
        <Pumpkin />
    </Container>
);

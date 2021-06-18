import styled from '@emotion/styled';
import React from 'react';

import { VimpelMedPalme } from './components/ikoner/VimpelMedPalmeIkon';

const Container = styled.div`
    display: flex;
    flex-grow: 1;
`;

const EasterEgg = () => (
    <Container>
        <VimpelMedPalme />
    </Container>
);

export default EasterEgg;

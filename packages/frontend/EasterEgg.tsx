import styled from '@emotion/styled';
import React from 'react';
import PåskeEgg from './routes/saksbilde/ikoner/PåskeEgg';

const Container = styled.div`
    display: flex;
    flex-grow: 1;
`;

export const EasterEgg = () => (
    <Container>
        <PåskeEgg />
    </Container>
);

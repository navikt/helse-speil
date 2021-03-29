import React from 'react';
import styled from '@emotion/styled';
import PåskeEgg from './components/ikoner/PåskeEgg';

const Container = styled.div`
    display: flex;
    margin-left: 1rem;
    flex-grow: 1;
`;

const EasterEgg = () => (
    <Container>
        <PåskeEgg />
    </Container>
);

export default EasterEgg;

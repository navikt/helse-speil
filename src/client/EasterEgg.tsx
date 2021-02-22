import React from 'react';
import Snøfnugg from './components/ikoner/Snøfnugg';
import SkiingCucumber from './components/ikoner/SkiingCucumber';
import styled from '@emotion/styled';

const Container = styled.div`
    display: flex;
    margin-left: 1rem;
`;

const SnøfnuggLav = styled.div`
    margin-top: 1.5rem;
    margin-right: 0.5rem;
`;

const SnøfnuggHøy = styled.div`
    margin-bottom: 0.8rem;
    margin-right: 0.5rem;
    padding-top: 0.5rem;
`;

const Margin = styled.div`
    margin-right: 0.5rem;
    display: flex;
`;

const EasterEgg = () => (
    <Container>
        <SnøfnuggHøy>
            <Snøfnugg />
        </SnøfnuggHøy>
        <SnøfnuggLav>
            <Snøfnugg />
        </SnøfnuggLav>
        <SnøfnuggHøy>
            <Snøfnugg />
        </SnøfnuggHøy>
        <SnøfnuggLav>
            <Snøfnugg />
        </SnøfnuggLav>
        <SnøfnuggHøy>
            <Snøfnugg />
        </SnøfnuggHøy>
        <SnøfnuggLav>
            <Snøfnugg />
        </SnøfnuggLav>
        <Margin>
            <SkiingCucumber />
        </Margin>
        <SnøfnuggHøy>
            <Snøfnugg />
        </SnøfnuggHøy>
        <SnøfnuggLav>
            <Snøfnugg />
        </SnøfnuggLav>
        <SnøfnuggHøy>
            <Snøfnugg />
        </SnøfnuggHøy>
        <SnøfnuggLav>
            <Snøfnugg />
        </SnøfnuggLav>
        <SnøfnuggHøy>
            <Snøfnugg />
        </SnøfnuggHøy>
    </Container>
);

export default EasterEgg;

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Tidslinjevindu } from './Tidslinje.types';

const Container = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const Vinduknapp = styled.button<{ active: boolean }>`
    border: none;
    background: none;
    font-size: 1rem;
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    color: #0067c5;
    cursor: pointer;

    &:active,
    &:focus {
        outline: none;
    }

    &:hover {
        text-decoration: underline;
    }

    ${(props) =>
        props.active &&
        `
        text-decoration: underline;
    `}
`;

interface VinduvelgerProps {
    vinduer: Tidslinjevindu[];
    aktivtVindu: number;
    setAktivtVindu: (index: number) => void;
}

const Vinduvelger = ({ vinduer, aktivtVindu, setAktivtVindu }: VinduvelgerProps) => {
    const [aktivSkala, setAktivSkala] = useState(0);
    return (
        <Container>
            {vinduer.map((vindu, i) => (
                <Vinduknapp key={vindu.label} active={aktivtVindu === i} onClick={() => setAktivtVindu(i)}>
                    {vindu.label}
                </Vinduknapp>
            ))}
        </Container>
    );
};

export default Vinduvelger;

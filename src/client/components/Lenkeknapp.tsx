import React from 'react';
import styled from '@emotion/styled';

const Lenkeknapp = styled.button`
    cursor: pointer;
    -webkit-appearance: none;
    background: none;
    border: none;
    padding: 0;
    color: #0067c5;
    font-size: 1rem;
    font-family: inherit;
    text-decoration: underline;

    &:hover {
        text-decoration: none;
    }

    &:focus,
    &:active {
        outline: none;
        background: #254b6d;
        box-shadow: 0 0 0 2px #254b6d;
        color: white;
    }
`;

export default Lenkeknapp;

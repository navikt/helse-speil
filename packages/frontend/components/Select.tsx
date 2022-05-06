import styled from '@emotion/styled';
import React from 'react';

const StyledSelect = styled.select`
    width: 100%;
    background: var(--navds-semantic-color-canvas-background-light);
    border-radius: 3px;
    border: 1px solid var(--navds-semantic-color-border);
    color: var(--navds-semantic-color-text);
    font-size: 16px;
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    appearance: none;
    padding: 6px 12px;

    &:active,
    &:focus {
        outline: none;
    }

    &:focus {
        box-shadow: 0 0 0 2px var(--navds-semantic-color-focus);
    }
`;

const chevron = (angle: number, right: number) => `
    content: '';
    position: absolute;
    width: 10px;
    height: 2px;
    border-radius: 2px;
    background: var(--navds-semantic-color-text);
    right: ${right}px;
    top: calc(50% + 1px);
    transform: translateY(-50%) rotate(${angle}deg);
`;

const SelectWrapper = styled.div`
    position: relative;

    &:after {
        ${chevron(45, 20)}
    }

    &:before {
        ${chevron(-45, 14)}
    }
`;

export const Select = (props: React.HTMLAttributes<HTMLSelectElement>) => (
    <SelectWrapper>
        <StyledSelect {...props} />
    </SelectWrapper>
);

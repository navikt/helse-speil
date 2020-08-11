import React, { SelectHTMLAttributes } from 'react';
import styled from '@emotion/styled';

const StyledSelect = styled.select`
    width: 100%;
    background: #fff;
    border-radius: 3px;
    border: 1px solid #3e3832;
    color: #3e3832;
    font-size: 16px;
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    appearance: none;
    padding: 6px 12px;

    &:active,
    &:focus {
        outline: none;
    }

    &:focus {
        box-shadow: 0 0 0 2px #254b6d;
    }
`;

const chevron = (angle: number, right: number) => `
    content: '';
    position: absolute;
    width: 10px;
    height: 2px;
    border-radius: 2px;
    background: #3e3832;
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

export const Select = (props: SelectHTMLAttributes<any>) => (
    <SelectWrapper>
        <StyledSelect {...props} />
    </SelectWrapper>
);

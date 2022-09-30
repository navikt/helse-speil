import styled from '@emotion/styled';
import { Property } from 'csstype';
import React from 'react';

interface CellContentProps {
    justifyContent?: Property.JustifyContent;
}

export const CellContent = styled.div<CellContentProps>`
    position: relative;
    display: flex;
    align-items: center;
    white-space: nowrap;

    justify-content: ${({ justifyContent }) => justifyContent ?? 'initial'};
`;

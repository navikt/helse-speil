import React from 'react';
import styled from '@emotion/styled';

type BasicValue = 'normal' | 'stretch';

type GlobalValue = 'inherit' | 'initial' | 'unset';

type PositionalValue = 'center' | 'start' | 'end' | 'flex-end' | 'flex-start';

type BaselineValue = 'baseline' | 'first baseline' | 'last baseline' | 'safe center' | 'unsafe center';

type AlignValue = BasicValue | GlobalValue | PositionalValue | BaselineValue;

interface FlexProps {
    alignItems?: AlignValue;
    alignContent?: AlignValue;
    justifyItems?: AlignValue;
    justifyContent?: AlignValue;
}

export const Flex = styled.div<FlexProps>`
    display: flex;
    ${({ alignItems }) => alignItems && `align-items: ${alignItems};`}
    ${({ alignContent }) => alignContent && `align-content: ${alignContent};`}
    ${({ justifyItems }) => justifyItems && `justify-items: ${justifyItems};`}
    ${({ justifyContent }) => justifyContent && `justify-content: ${justifyContent};`}
`;

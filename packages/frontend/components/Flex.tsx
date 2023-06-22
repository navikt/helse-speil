import styled from '@emotion/styled';

type BasicValue = 'normal' | 'stretch';

type GlobalValue = 'inherit' | 'initial' | 'unset';

type UnitValue = `${number}${'px' | 'rem' | 'em'}`;

type PositionalValue =
    | 'center'
    | 'start'
    | 'end'
    | 'flex-end'
    | 'flex-start'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';

type BaselineValue = 'baseline' | 'first baseline' | 'last baseline' | 'safe center' | 'unsafe center';

type AlignValue = BasicValue | GlobalValue | PositionalValue | BaselineValue;

interface FlexProps {
    alignItems?: AlignValue;
    alignContent?: AlignValue;
    justifyItems?: AlignValue;
    justifyContent?: AlignValue;
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse' | GlobalValue;
    flex?: number;
    gap?: UnitValue;
}

export const Flex = styled.div<FlexProps>`
    display: flex;
    ${({ alignItems }) => alignItems && `align-items: ${alignItems};`}
    ${({ alignContent }) => alignContent && `align-content: ${alignContent};`}
    ${({ justifyItems }) => justifyItems && `justify-items: ${justifyItems};`}
    ${({ justifyContent }) => justifyContent && `justify-content: ${justifyContent};`}
    ${({ flexDirection }) => flexDirection && `flex-direction: ${flexDirection};`}
    ${({ flex }) => flex !== undefined && `flex: ${flex};`}
    ${({ gap }) => gap !== undefined && `gap: ${gap};`}
`;

export const FlexColumn = styled(Flex)`
    flex-direction: column;
`;

import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { HeaderView } from './Oversikt.styles';
import { Undertekst } from 'nav-frontend-typografi';

const Sorteringsknapp = styled.button`
    padding: 0 1rem 0 0;
    background: none;
    outline: none;
    border: none;
    display: flex;
    align-items: center;
    cursor: pointer;
`;

const Sorteringspiler = styled.div<{ direction: string }>`
    pointer-events: none;
    position: relative;
    height: 0.75rem;
    margin-left: 0.5rem;

    &:before,
    &:after {
        pointer-events: none;
        content: '';
        border-left: 0.25rem solid white;
        border-right: 0.25rem solid white;
        position: absolute;
        transition: all 0.1s ease;
    }

    &:before {
        border-bottom: 0.25rem solid #b7b1a9;
        transition: all 0.1s ease;
    }

    &:after {
        border-top: 0.25rem solid #3e3832;
        bottom: 0;
        transition: all 0.1s ease;
    }

    ${(props) =>
        props.direction === 'ascending' &&
        `
        &:after { transform: translateY(-0.5rem) rotate(180deg); }
        &:before { transform: translateY(0.5rem) rotate(180deg); }
    `}
`;

interface SorterbarHeaderProps {
    children: ReactNode | ReactNode[];
    onToggleSort: () => void;
    sortDirection: 'ascending' | 'descending';
    widthInPixels?: number;
}

export const SorterbarHeader = ({ children, onToggleSort, sortDirection, widthInPixels }: SorterbarHeaderProps) => (
    <HeaderView widthInPixels={widthInPixels}>
        <Sorteringsknapp onClick={onToggleSort}>
            <Undertekst>{children}</Undertekst>
            <Sorteringspiler direction={sortDirection} />
        </Sorteringsknapp>
    </HeaderView>
);

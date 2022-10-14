import styled from '@emotion/styled';
import React from 'react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { SortationState, useSetSortation } from './state/sortation';

const Button = styled.button<{ state: SortationState }>`
    border: none;
    cursor: pointer;
    background: none;
    user-select: none;
    color: var(--navds-semantic-color-text);
    padding: 0 1.25rem 0 0;
    position: relative;

    &:before,
    &:after {
        pointer-events: none;
        content: '';
        border-left: 0.25rem solid var(--navds-semantic-color-canvas-background-light);
        border-right: 0.25rem solid var(--navds-semantic-color-canvas-background-light);
        position: absolute;
        right: 0.25rem;
        top: 50%;
    }

    &:before {
        border-bottom: 0.25rem solid #b7b1a9;
        transform: translateY(calc(-50% - 0.25rem));
        ${(props) => props.state === 'descending' && `border-bottom-color: var(--navds-semantic-color-text)`}
    }

    &:after {
        border-top: 0.25rem solid #b7b1a9;
        transform: translateY(calc(-50% + 0.25rem));
        ${(props) => props.state === 'ascending' && `border-top-color: var(--navds-semantic-color-text)`}
    }
`;

interface SortButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    label: string;
    state: SortationState;
    onSort: (a: OppgaveForOversiktsvisning, b: OppgaveForOversiktsvisning) => number;
}

export const SortButton = ({ children, state, onSort, label, ...rest }: SortButtonProps) => {
    const setSortation = useSetSortation();

    const sort = () => {
        const newState = state === 'none' ? 'ascending' : state === 'ascending' ? 'descending' : 'none';
        const newFunction =
            newState === 'ascending'
                ? onSort
                : newState === 'descending'
                ? (a: OppgaveForOversiktsvisning, b: OppgaveForOversiktsvisning) => onSort(b, a)
                : (_a: OppgaveForOversiktsvisning, _b: OppgaveForOversiktsvisning) => 0;

        setSortation({ label, function: newFunction, state: newState });
    };

    return (
        <Button state={state} onClick={sort} {...rest}>
            {children}
        </Button>
    );
};

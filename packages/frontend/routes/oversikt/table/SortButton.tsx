import classNames from 'classnames';
import React from 'react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { SortationState, useSetSortation } from './state/sortation';

import styles from './SortButton.module.css';

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
        <button className={classNames(styles.SortButton, styles[state])} onClick={sort} {...rest}>
            {children}
        </button>
    );
};

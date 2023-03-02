import React from 'react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { Header } from './Header';
import { SortButton } from './SortButton';
import { Sortation } from './state/sortation';

interface SorterbarHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    sortation: Sortation<OppgaveForOversiktsvisning> | null;
    label: string;
    onSort: (a: any, b: any) => number;
}

export const SortableHeader: React.FC<SorterbarHeaderProps> = ({ sortation, label, onSort, children }) => {
    return (
        <Header scope="col" colSpan={1} aria-sort={sortation?.label === label ? sortation.state : 'none'}>
            <SortButton label={label} onSort={onSort} state={sortation?.label === label ? sortation.state : 'none'}>
                {children}
            </SortButton>
        </Header>
    );
};

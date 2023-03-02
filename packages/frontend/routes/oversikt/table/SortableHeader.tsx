import React from 'react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { Header } from './Header';
import { SortButton } from './SortButton';
import { Sortation } from './state/sortation';

interface SorterbarHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    sortation: Sortation<OppgaveForOversiktsvisning> | null;
    sortKey: string;
    onSort: (a: any, b: any) => number;
}

export const SortableHeader: React.FC<SorterbarHeaderProps> = ({ sortation, sortKey, onSort, children }) => {
    return (
        <Header scope="col" colSpan={1} aria-sort={sortation?.sortKey === sortKey ? sortation.state : 'none'}>
            <SortButton
                sortKey={sortKey}
                onSort={onSort}
                state={sortation?.sortKey === sortKey ? sortation.state : 'none'}
            >
                {children}
            </SortButton>
        </Header>
    );
};

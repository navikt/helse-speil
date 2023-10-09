import React from 'react';

import { Table } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';

import { FilterButton } from '../FilterButton';
import { Filter, Oppgaveoversiktkolonne } from '../state/filter';

interface FilterHeaderProps {
    filters: Filter<OppgaveTilBehandling>[];
    column: Oppgaveoversiktkolonne;
    text: string;
}

export const FilterHeader = ({ filters, column, text }: FilterHeaderProps) => {
    const numberOfFilters = filters.filter((it) => it.column === column && it.active).length;
    return (
        <Table.HeaderCell scope="col" colSpan={1}>
            <FilterButton filters={filters.filter((it) => it.column === column)}>
                {`${text} (${numberOfFilters})`}
            </FilterButton>
        </Table.HeaderCell>
    );
};

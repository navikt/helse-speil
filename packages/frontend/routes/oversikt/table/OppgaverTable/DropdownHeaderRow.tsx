import React from 'react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { TabType } from '../../tabState';
import { FilterButton } from '../FilterButton';
import { Header } from '../Header';
import { Filter } from '../state/filter';
import styles from '../table.module.css';

interface DropdownHeaderProps {
    tab: TabType;
    filters: Filter<OppgaveForOversiktsvisning>[];
}

export const DropdownHeaderRow = ({ tab, filters }: DropdownHeaderProps) => (
    <tr className={styles.DropdownHeader}>
        {tab === TabType.TilGodkjenning ? (
            <FilterHeader filters={filters} column={0} text="Tildelt" />
        ) : (
            <Header scope="col" colSpan={1} />
        )}
        <FilterHeader filters={filters} column={1} text="Periodetype" />
        <FilterHeader filters={filters} column={2} text="Oppgavetype" />
        <FilterHeader filters={filters} column={3} text="Mottaker" />
        <FilterHeader filters={filters} column={4} text="Egenskaper" />
        <FilterHeader filters={filters} column={5} text="Inntektskilde" />
    </tr>
);

interface FilterHeaderProps {
    filters: Filter<OppgaveForOversiktsvisning>[];
    column: number;
    text: string;
}

const FilterHeader = ({ filters, column, text }: FilterHeaderProps) => {
    const numberOfFilters = filters.filter((it) => it.column === column && it.active).length;
    return (
        <Header scope="col" colSpan={1}>
            <FilterButton
                filters={filters.filter((it) => it.column === column)}
            >{`${text} (${numberOfFilters})`}</FilterButton>
        </Header>
    );
};

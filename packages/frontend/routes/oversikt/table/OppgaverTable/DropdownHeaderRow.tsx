import React from 'react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { TabType } from '../../Tabs';
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
        <Header scope="col" colSpan={1}>
            {tab === TabType.TilGodkjenning ? (
                <FilterButton filters={filters.filter((it) => it.column === 0)}>Tildelt</FilterButton>
            ) : (
                'Tildelt'
            )}
        </Header>
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

const FilterHeader = ({ filters, column, text }: FilterHeaderProps) => (
    <Header scope="col" colSpan={1}>
        <FilterButton filters={filters.filter((it) => it.column === column)}>{text}</FilterButton>
    </Header>
);

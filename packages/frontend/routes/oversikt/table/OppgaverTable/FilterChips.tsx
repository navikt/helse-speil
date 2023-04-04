import React from 'react';

import { Chips } from '@navikt/ds-react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { Filter } from '../state/filter';
import styles from '../table.module.css';

interface FilterChipsProps {
    activeFilters: Filter<OppgaveForOversiktsvisning>[];
    toggleFilter: (label: string) => void;
    setMultipleFilters: (value: boolean, ...labels: string[]) => void;
}

export const FilterChips = ({ activeFilters, toggleFilter, setMultipleFilters }: FilterChipsProps) => (
    <Chips className={styles.FilterChips}>
        {activeFilters.map((filter) => (
            <Chips.Removable onClick={() => toggleFilter(filter.label)}>{filter.label}</Chips.Removable>
        ))}
        {activeFilters.length > 0 && (
            <Chips.Removable
                onClick={() => setMultipleFilters(false, ...activeFilters.map((filter) => filter.label))}
                variant="neutral"
            >
                Nullstill alle
            </Chips.Removable>
        )}
    </Chips>
);

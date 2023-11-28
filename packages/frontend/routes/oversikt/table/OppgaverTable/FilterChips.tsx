import classNames from 'classnames';
import React from 'react';

import { Chips } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';

import { Filter } from '../state/filter';

import styles from './filterChips.module.css';

interface FilterChipsProps {
    activeFilters: Filter<OppgaveTilBehandling>[];
    toggleFilter: (label: string) => void;
    setMultipleFilters: (value: boolean, ...labels: string[]) => void;
}

export const FilterChips = ({ activeFilters, toggleFilter, setMultipleFilters }: FilterChipsProps) => {
    if (activeFilters.length > 0) {
        return (
            <Chips className={classNames(styles.filterChips)}>
                {activeFilters.map((filter) => (
                    <Chips.Removable key={filter.label} onClick={() => toggleFilter(filter.label)}>
                        {filter.label}
                    </Chips.Removable>
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
    }

    return (
        <Chips className={classNames(styles.filterChips)}>
            <Chips.Toggle className={styles.ingenValgteFilter} disabled>
                Ingen aktive filter
            </Chips.Toggle>
        </Chips>
    );
};

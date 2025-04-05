import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { Chips } from '@navikt/ds-react';

import { Filter, FilterStatus } from '../state/filter';

import styles from './filterChips.module.css';

interface FilterChipsProps {
    activeFilters: Filter[];
    toggleFilter: (label: string, status: FilterStatus) => void;
    setMultipleFilters: (filterStatus: FilterStatus, ...keys: string[]) => void;
}

export const FilterChips = ({ activeFilters, toggleFilter, setMultipleFilters }: FilterChipsProps): ReactElement => {
    if (activeFilters.length > 0) {
        return (
            <Chips className={classNames(styles.filterChips)}>
                {activeFilters.map((filter) => (
                    <Chips.Removable
                        className={classNames(filter.status === FilterStatus.MINUS && styles.filteredOut)}
                        key={filter.key}
                        onClick={() => toggleFilter(filter.key, FilterStatus.OFF)}
                    >
                        {filter.label}
                    </Chips.Removable>
                ))}
                {activeFilters.length > 0 && (
                    <Chips.Removable
                        onClick={() =>
                            setMultipleFilters(FilterStatus.OFF, ...activeFilters.map((filter) => filter.key))
                        }
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

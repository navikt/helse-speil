import classNames from 'classnames';
import { useAtom } from 'jotai';
import React, { ReactElement } from 'react';

import { Chips } from '@navikt/ds-react';

import { lagOppslåttSaksbehandlerVisningsnavn } from '@oversikt/filtermeny/SøkefeltSaksbehandlere';

import { Filter, FilterStatus, valgtSaksbehandlerAtom } from '../state/filter';

import styles from './filterChips.module.css';

interface FilterChipsProps {
    activeFilters: Filter[];
    toggleFilter: (label: string, status: FilterStatus) => void;
    setMultipleFilters: (filterStatus: FilterStatus, ...keys: string[]) => void;
}

export const FilterChips = ({ activeFilters, toggleFilter, setMultipleFilters }: FilterChipsProps): ReactElement => {
    const [valgtSaksbehandler, setValgtSaksbehandler] = useAtom(valgtSaksbehandlerAtom);
    if (activeFilters.length > 0 || valgtSaksbehandler) {
        return (
            <Chips className={classNames(styles.filterChips)}>
                {valgtSaksbehandler && (
                    <Chips.Removable key={'valgtsaksbehandler'} onClick={() => setValgtSaksbehandler(null)}>
                        {lagOppslåttSaksbehandlerVisningsnavn(valgtSaksbehandler)}
                    </Chips.Removable>
                )}
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
                        onClick={() => {
                            setMultipleFilters(FilterStatus.OFF, ...activeFilters.map((filter) => filter.key));
                            setValgtSaksbehandler(null);
                        }}
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

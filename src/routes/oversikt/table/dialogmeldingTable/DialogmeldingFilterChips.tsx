import React, { ReactElement } from 'react';

import { Chips } from '@navikt/ds-react';

import { FilterStatus } from '@oversikt/table/state/filter';
import { cn } from '@utils/tw';

interface DialogmeldingFilterChipsProps {
    activeFilters: { key: string; label: string; status: FilterStatus }[];
    toggleFilter: (key: string, status: FilterStatus) => void;
    setMultipleFilters: (filterStatus: FilterStatus, ...keys: string[]) => void;
}

export const DialogmeldingFilterChips = ({
    activeFilters,
    toggleFilter,
    setMultipleFilters,
}: DialogmeldingFilterChipsProps): ReactElement => {
    if (activeFilters.length > 0) {
        return (
            <Chips className="mx-3 mt-1 mb-2">
                {activeFilters.map((filter) => (
                    <Chips.Removable
                        className={cn({
                            'bg-ax-bg-danger-strong hover:bg-ax-bg-danger-strong-hover':
                                filter.status === FilterStatus.MINUS,
                        })}
                        key={filter.key}
                        onClick={() => toggleFilter(filter.key, FilterStatus.OFF)}
                    >
                        {filter.label}
                    </Chips.Removable>
                ))}
                <Chips.Removable
                    onClick={() => setMultipleFilters(FilterStatus.OFF, ...activeFilters.map((f) => f.key))}
                    data-color="neutral"
                >
                    Nullstill alle
                </Chips.Removable>
            </Chips>
        );
    }

    return (
        <Chips className="mx-3 mt-1 mb-2">
            <Chips.Toggle className="cursor-default" checkmark={false}>
                Ingen aktive filter
            </Chips.Toggle>
        </Chips>
    );
};

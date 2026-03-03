import { useAtom } from 'jotai';
import React, { ReactElement } from 'react';

import { Chips } from '@navikt/ds-react';

import { lagOppslåttSaksbehandlerVisningsnavn } from '@oversikt/filtermeny/SøkefeltSaksbehandlere';
import { TabType } from '@oversikt/tabState';
import { cn } from '@utils/tw';

import { Filter, FilterStatus, valgtSaksbehandlerAtom } from '../state/filter';

interface FilterChipsProps {
    activeFilters: Filter[];
    toggleFilter: (label: string, status: FilterStatus) => void;
    setMultipleFilters: (filterStatus: FilterStatus, ...keys: string[]) => void;
    aktivTab: TabType;
}

export const FilterChips = ({
    activeFilters,
    toggleFilter,
    setMultipleFilters,
    aktivTab,
}: FilterChipsProps): ReactElement => {
    const [valgtSaksbehandler, setValgtSaksbehandler] = useAtom(valgtSaksbehandlerAtom);
    const erFiltrertPåSaksbehandler = valgtSaksbehandler && aktivTab === TabType.TilGodkjenning;
    if (activeFilters.length > 0 || erFiltrertPåSaksbehandler) {
        return (
            <Chips className="mx-3 mt-1 mb-2">
                {erFiltrertPåSaksbehandler && (
                    <Chips.Removable key="valgtsaksbehandler" onClick={() => setValgtSaksbehandler(null)}>
                        {lagOppslåttSaksbehandlerVisningsnavn(valgtSaksbehandler)}
                    </Chips.Removable>
                )}
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
                {activeFilters.length > 0 && (
                    <Chips.Removable
                        onClick={() => {
                            setMultipleFilters(FilterStatus.OFF, ...activeFilters.map((filter) => filter.key));
                            setValgtSaksbehandler(null);
                        }}
                        data-color="neutral"
                    >
                        Nullstill alle
                    </Chips.Removable>
                )}
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

import { WritableAtom, atom, useAtom, useAtomValue } from 'jotai';
import { SetStateAction } from 'react';

import { ApiDialogmeldingStatus, ApiFagomrade } from '@io/rest/generated/sporhund.schemas';
import { atomWithLocalStorage } from '@state/jotai';

import { Filter, FilterStatus } from './filter';

export enum DialogmeldingKolonne {
    FAGOMRADE = 'FAGOMRADE',
    STATUS = 'STATUS',
}

const dialogmeldingFilters: Filter[] = [
    // Fagområde
    {
        key: ApiFagomrade.ENKELTSTAENDE_BEHANDLINGSDAGER,
        label: 'Enkeltstående behandlingsdager',
        status: FilterStatus.OFF,
        column: DialogmeldingKolonne.FAGOMRADE,
    },
    {
        key: ApiFagomrade.TILBAKEDATERING,
        label: 'Tilbakedatering',
        status: FilterStatus.OFF,
        column: DialogmeldingKolonne.FAGOMRADE,
    },
    {
        key: ApiFagomrade.YRKESSKADE,
        label: 'Yrkesskade',
        status: FilterStatus.OFF,
        column: DialogmeldingKolonne.FAGOMRADE,
    },
    {
        key: ApiFagomrade.BESTRIDELSE,
        label: 'Bestridelse',
        status: FilterStatus.OFF,
        column: DialogmeldingKolonne.FAGOMRADE,
    },
    // Status
    {
        key: ApiDialogmeldingStatus.SENDT,
        label: 'Sendt',
        status: FilterStatus.OFF,
        column: DialogmeldingKolonne.STATUS,
    },
    {
        key: ApiDialogmeldingStatus.PURRING_SENDT,
        label: 'Purring sendt',
        status: FilterStatus.OFF,
        column: DialogmeldingKolonne.STATUS,
    },
    {
        key: ApiDialogmeldingStatus.MOTTATT,
        label: 'Mottatt',
        status: FilterStatus.OFF,
        column: DialogmeldingKolonne.STATUS,
    },
    {
        key: ApiDialogmeldingStatus.AVVIST,
        label: 'Avvist',
        status: FilterStatus.OFF,
        column: DialogmeldingKolonne.STATUS,
    },
    // {
    //     key: ApiDialogmeldingStatus.FERDIGSTILT,
    //     label: 'Ferdigstilt',
    //     status: FilterStatus.OFF,
    //     column: DialogmeldingKolonne.STATUS,
    // },
];

const dialogmeldingFilterState = atomWithLocalStorage<Filter[]>('dialogmeldingFilters', dialogmeldingFilters);

const getDefaultDialogmeldingFilters = (): Filter[] => [...dialogmeldingFilters];

export function hydrateDialogmeldingFilters(): [WritableAtom<Filter[], [SetStateAction<Filter[]>], void>, Filter[]] {
    const filtersFromStorage = localStorage.getItem('dialogmeldingFilters');
    if (filtersFromStorage == null) return [dialogmeldingFilterState, getDefaultDialogmeldingFilters()];

    const stored: Filter[] = JSON.parse(filtersFromStorage);
    const defaults = getDefaultDialogmeldingFilters();

    const hydrated = defaults.map((defaultFilter) => {
        const storedFilter = stored.find((f) => f.key === defaultFilter.key);
        if (!storedFilter) return defaultFilter;

        return {
            ...storedFilter,
            label: storedFilter.label !== defaultFilter.label ? defaultFilter.label : storedFilter.label,
            column: storedFilter.column !== defaultFilter.column ? defaultFilter.column : storedFilter.column,
        };
    });

    return [dialogmeldingFilterState, hydrated];
}

const activeDialogmeldingFilters = atom((get) =>
    get(dialogmeldingFilterState).filter((f) => f.status !== FilterStatus.OFF),
);

export const useDialogmeldingFilters = () => ({
    allFilters: useAtomValue(dialogmeldingFilterState),
    activeFilters: useAtomValue(activeDialogmeldingFilters),
});

export const useToggleDialogmeldingFilter = () => {
    const [filters, setFilters] = useAtom(dialogmeldingFilterState);
    return (key: string, status: FilterStatus) => {
        setFilters(filters.map((filter) => (filter.key === key ? { ...filter, status } : filter)));
    };
};

export const useSetMultipleDialogmeldingFilters = () => {
    const [filters, setFilters] = useAtom(dialogmeldingFilterState);
    return (filterStatus: FilterStatus, ...keys: string[]) => {
        setFilters(filters.map((it) => (keys.includes(it.key) ? { ...it, status: filterStatus } : it)));
    };
};

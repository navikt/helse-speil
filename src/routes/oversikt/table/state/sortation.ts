import { atom, useAtomValue, useSetAtom } from 'jotai';

import { SortState } from '@navikt/ds-react';

import { TabType, tabState } from '@oversikt/tabState';
import { atomWithLocalStorage } from '@state/jotai';

export enum SortKey {
    Saksbehandler = 'saksbehandler',
    Opprettet = 'opprettet',
    Søker = 'søker',
    Tidsfrist = 'tidsfrist',
    BehandlingOpprettetTidspunkt = 'behandlingOpprettetTidspunkt',
}

const dateSortKeys: SortKey[] = [SortKey.Opprettet, SortKey.Tidsfrist, SortKey.BehandlingOpprettetTidspunkt];
const erDatoSortKey = (key: SortKey): boolean => dateSortKeys.includes(key);

const defaultSortering: SortState = {
    orderBy: SortKey.Opprettet,
    direction: 'ascending',
};

type SorteringPerTab = { [key in TabType]: SortState };

const sorteringPerTab = atomWithLocalStorage<SorteringPerTab>('sorteringPerTab', {
    [TabType.TilGodkjenning]: defaultSortering,
    [TabType.Mine]: defaultSortering,
    [TabType.Ventende]: { orderBy: SortKey.Tidsfrist, direction: 'ascending' },
    [TabType.BehandletIdag]: defaultSortering,
});

const defaultDatoSortKey: Record<TabType, SortKey> = {
    [TabType.TilGodkjenning]: SortKey.Opprettet,
    [TabType.Mine]: SortKey.Opprettet,
    [TabType.Ventende]: SortKey.Tidsfrist,
    [TabType.BehandletIdag]: SortKey.Opprettet,
};

type DatoSortKeyPerTab = { [key in TabType]: SortKey };

const datoSortKeyPerTab = atomWithLocalStorage<DatoSortKeyPerTab>('dateSortKeyPerTab', {
    [TabType.TilGodkjenning]: SortKey.Opprettet,
    [TabType.Mine]: SortKey.Opprettet,
    [TabType.Ventende]: SortKey.Tidsfrist,
    [TabType.BehandletIdag]: SortKey.Opprettet,
});

const sortering = atom((get) => get(sorteringPerTab)[get(tabState)] as SortState);

export const useSorteringValue = () => useAtomValue(sortering);

export const useSetSortering = () => {
    const setSort = useSetAtom(sorteringPerTab);
    const tab = useAtomValue(tabState);
    return (sort: SortState, sortKey: SortKey) => {
        void setSort((prev) => ({
            ...prev,
            [tab]: {
                orderBy: sortKey,
                direction: sort.direction === 'descending' ? 'ascending' : 'descending',
            },
        }));
    };
};

export const useSetDatoSortering = () => {
    const setDatoKey = useSetAtom(datoSortKeyPerTab);
    const setSort = useSetAtom(sorteringPerTab);
    const tab = useAtomValue(tabState);
    return (nyDatoKey: SortKey) => {
        void setDatoKey((prev) => ({ ...prev, [tab]: nyDatoKey }));
        void setSort((prev) => ({
            ...prev,
            [tab]: { orderBy: nyDatoKey, direction: defaultSortering.direction },
        }));
    };
};

const datoSortKey = atom((get) => {
    const sort = get(sorteringPerTab)[get(tabState)];
    if (erDatoSortKey(sort.orderBy as SortKey)) return sort.orderBy as SortKey;
    return get(datoSortKeyPerTab)[get(tabState)] ?? defaultDatoSortKey[get(tabState)];
});

export const useDateSortValue = () => useAtomValue(datoSortKey);

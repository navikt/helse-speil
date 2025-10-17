import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

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

const stringTilSortKey = (nøkkel: string): SortKey => {
    switch (nøkkel) {
        case 'saksbehandler':
            return SortKey.Saksbehandler;
        case 'opprettet':
            return SortKey.Opprettet;
        case 'søker':
            return SortKey.Søker;
        case 'tidsfrist':
            return SortKey.Tidsfrist;
        case 'behandlingOpprettetTidspunkt':
            return SortKey.BehandlingOpprettetTidspunkt;
        default:
            return SortKey.BehandlingOpprettetTidspunkt;
    }
};

const sortKeyTilString = (sortKey: SortKey): string => {
    switch (sortKey) {
        case SortKey.Søker:
            return 'søker';
        case SortKey.Saksbehandler:
            return 'saksbehandler';
        case SortKey.Opprettet:
            return 'opprettet';
        case SortKey.BehandlingOpprettetTidspunkt:
            return 'behandlingOpprettetTidspunkt';
        case SortKey.Tidsfrist:
            return 'tidsfrist';
    }
};

const defaultSortation: SortState = {
    orderBy: sortKeyTilString(SortKey.Opprettet),
    direction: 'ascending',
};

type SorteringPerTab = { [key in TabType]: SortState };

const sorteringPerTab = atomWithLocalStorage<SorteringPerTab>('sorteringPerTab', {
    [TabType.TilGodkjenning]: defaultSortation,
    [TabType.Mine]: defaultSortation,
    [TabType.Ventende]: defaultSortation,
    [TabType.BehandletIdag]: defaultSortation,
});

const sortering = atom(
    (get) => {
        const lagretSortState = get(sorteringPerTab)[get(tabState)];
        return {
            ...lagretSortState,
            orderBy: stringTilSortKey(lagretSortState.orderBy),
        };
    },
    (get, set, newValue: SortState) =>
        set(sorteringPerTab, (prevState) => ({
            ...prevState,
            [get(tabState)]: { ...newValue, orderBy: sortKeyTilString(newValue.orderBy as SortKey) },
        })),
);

export const useSorteringValue = () => useAtomValue(sortering);

export const useSetSortering = () => {
    const setSortering = useSetAtom(sortering);
    return (sort: SortState, sortKey: SortKey) => {
        const sortState: SortState = {
            orderBy: sortKey,
            direction: sort.direction === 'descending' ? 'ascending' : 'descending',
        };

        setSortering(sortState);
    };
};

const stringSomDatofeltSortKey = (nøkkel: string): SortKey => {
    switch (nøkkel) {
        case 'opprettet':
            return SortKey.Opprettet;
        case 'tidsfrist':
            return SortKey.Tidsfrist;
        case 'behandlingOpprettetTidspunkt':
            return SortKey.BehandlingOpprettetTidspunkt;
        default:
            return SortKey.BehandlingOpprettetTidspunkt;
    }
};

const datofeltSortKeySomString = (sortKey: SortKey): string => {
    switch (sortKey) {
        case SortKey.Opprettet:
            return 'opprettet';
        case SortKey.Tidsfrist:
            return 'tidsfrist';
        case SortKey.BehandlingOpprettetTidspunkt:
            return 'behandlingOpprettetTidspunkt';
        default:
            return 'behandlingOpprettetTidspunkt';
    }
};

type DateSortKeyPerTab = { [key in TabType]: string };

const dateSortKeyPerTab = atomWithLocalStorage<DateSortKeyPerTab>('dateSortKeyPerTab', {
    [TabType.TilGodkjenning]: datofeltSortKeySomString(SortKey.Opprettet),
    [TabType.Mine]: datofeltSortKeySomString(SortKey.Opprettet),
    [TabType.Ventende]: datofeltSortKeySomString(SortKey.Opprettet),
    [TabType.BehandletIdag]: datofeltSortKeySomString(SortKey.Opprettet),
});

const dateSortKey = atom(
    (get) => stringSomDatofeltSortKey(get(dateSortKeyPerTab)[get(tabState)]),
    (get, set, newValue: SortKey) =>
        set(dateSortKeyPerTab, (prevState) => ({ ...prevState, [get(tabState)]: datofeltSortKeySomString(newValue) })),
);
export const useDateSortState = () => useAtom(dateSortKey);
export const useDateSortValue = () => useAtomValue(dateSortKey);

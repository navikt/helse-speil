import { AtomEffect, SetRecoilState, atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { SortState } from '@navikt/ds-react';

import { Maybe, OppgaveTilBehandling } from '@io/graphql';
import { TabType, tabState } from '@oversikt/tabState';

export enum SortKey {
    Saksbehandler = 'saksbehandler',
    SøknadMottatt = 'søknadMottatt',
    Opprettet = 'opprettet',
    Søker = 'søker',
    Tidsfrist = 'tidsfrist',
}

const defaultSortation: SortState = {
    orderBy: SortKey.Opprettet,
    direction: 'ascending',
};

const storageKeyForSortering = (tab: TabType) => 'sorteringForTab_' + tab;

const getSorteringFromLocalStorage = (tab: TabType): SortState => {
    const savedState = localStorage.getItem(storageKeyForSortering(tab));
    if (savedState != null) {
        return savedState ? JSON.parse(savedState) : undefined;
    } else {
        return defaultSortation;
    }
};

type SorteringPerTab = { [key in TabType]: SortState };

const sorteringPerTab = atom<SorteringPerTab>({
    key: 'sorteringPerTab',
    default: {
        [TabType.TilGodkjenning]: defaultSortation,
        [TabType.Mine]: defaultSortation,
        [TabType.Ventende]: defaultSortation,
        [TabType.BehandletIdag]: defaultSortation,
    },
});

export const hydrateSorteringForTab = (set: SetRecoilState) => {
    set(sorteringPerTab, {
        [TabType.TilGodkjenning]: getSorteringFromLocalStorage(TabType.TilGodkjenning),
        [TabType.Mine]: getSorteringFromLocalStorage(TabType.Mine),
        [TabType.Ventende]: getSorteringFromLocalStorage(TabType.Ventende),
        [TabType.BehandletIdag]: defaultSortation,
    });
};

const sorteringEndret = atom<boolean>({
    key: 'sorteringEndret',
    default: false,
});

export const useSorteringEndret = () => useRecoilValue(sorteringEndret);
export const useSetSorteringIkkeEndret = () => {
    const setEndret = useSetRecoilState(sorteringEndret);
    return () => {
        setEndret(false);
    };
};

const sortering = selector<SortState>({
    key: 'sortering',
    get: ({ get }) => {
        return get(sorteringPerTab)[get(tabState)];
    },
    set: ({ get, set }, newValue) => {
        localStorage.setItem(storageKeyForSortering(get(tabState)), newValue ? JSON.stringify(newValue) : '');
        set(sorteringPerTab, (sortering) => ({ ...sortering, [get(tabState)]: newValue }));
    },
});

export const useSorteringState = () => useRecoilValue(sortering);
export const useSetSortering = () => {
    const setSortering = useSetRecoilState(sortering);
    return (sortering: SortState) => {
        setSortering(sortering);
    };
};

export const useUpdateSort = () => {
    const setSorteringEndret = useSetRecoilState(sorteringEndret);
    return (sort: SortState, setSort: (state: SortState) => void, sortKey: SortKey) => {
        const sortState = {
            orderBy: sortKey,
            direction: sort.direction === 'descending' ? 'ascending' : 'descending',
        } as SortState;

        setSort(sortState);
        setSorteringEndret(true);
    };
};

const syncWithLocalStorageEffect: AtomEffect<SortKey> = ({ onSet, setSelf, trigger }) => {
    if (typeof window === 'undefined') return;
    const key = 'dateSortKey';
    const savedValue = localStorage.getItem(key) as SortKey;
    if (savedValue && trigger === 'get') {
        setSelf(savedValue);
    }
    onSet((newValue) => {
        localStorage.setItem(key, `${newValue}`);
    });
};

export const dateSortKey = atom<SortKey>({
    key: 'dateSortKey',
    default: SortKey.Opprettet,
    effects: [syncWithLocalStorageEffect],
});

export const getVisningsDato = (oppgave: OppgaveTilBehandling, sorteringsnøkkel: SortKey): Maybe<string> => {
    switch (sorteringsnøkkel) {
        case SortKey.SøknadMottatt:
            return oppgave.opprinneligSoknadsdato;
        case SortKey.Tidsfrist:
            return oppgave?.tidsfrist ?? null;
        case SortKey.Opprettet:
        default:
            return oppgave.opprettet;
    }
};

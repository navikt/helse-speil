import { AtomEffect, atom, selector, useSetRecoilState } from 'recoil';

import { SortState } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';

import { TabType, tabState } from '../../tabState';

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

const getSorteringFromLocalStorage = (tab: TabType): SortState | undefined => {
    const savedState = localStorage.getItem(storageKeyForSortering(tab));
    if (savedState != null) {
        return savedState ? JSON.parse(savedState) : undefined;
    } else {
        return defaultSortation;
    }
};

type SorteringPerTab = { [key in TabType]: SortState | undefined };

const sorteringPerTab = atom<SorteringPerTab>({
    key: 'sorteringPerTab',
    default: {
        [TabType.TilGodkjenning]: getSorteringFromLocalStorage(TabType.TilGodkjenning),
        [TabType.Mine]: getSorteringFromLocalStorage(TabType.Mine),
        [TabType.Ventende]: getSorteringFromLocalStorage(TabType.Ventende),
        [TabType.BehandletIdag]: defaultSortation,
    },
});

export const sorteringEndret = atom<boolean>({
    key: 'sorteringEndret',
    default: false,
});

export const sortering = selector<SortState | undefined>({
    key: 'sortering',
    get: ({ get }) => {
        return get(sorteringPerTab)[get(tabState)];
    },
    set: ({ get, set }, newValue) => {
        localStorage.setItem(storageKeyForSortering(get(tabState)), newValue ? JSON.stringify(newValue) : '');
        set(sorteringPerTab, (sortering) => ({ ...sortering, [get(tabState)]: newValue }));
    },
});

export const useUpdateSort = () => {
    const setSorteringEndret = useSetRecoilState(sorteringEndret);
    return (sort: SortState | undefined, setSort: (state: SortState | undefined) => void, sortKey: SortKey) => {
        const sortState =
            sort && sortKey === sort.orderBy && sort.direction === 'descending'
                ? undefined
                : ({
                      orderBy: sortKey,
                      direction:
                          sort && sortKey === sort.orderBy && sort.direction === 'ascending'
                              ? 'descending'
                              : 'ascending',
                  } as SortState);
        setSort(sortState);
        setSorteringEndret(true);
    };
};

const syncWithLocalStorageEffect: AtomEffect<SortKey> = ({ onSet, setSelf, trigger }) => {
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

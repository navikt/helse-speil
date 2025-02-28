import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { SetRecoilState, atom as recoilAtom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

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

const sorteringPerTab = recoilAtom<SorteringPerTab>({
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

const sorteringEndret = atom(false);

export const useSorteringEndret = () => useAtomValue(sorteringEndret);
export const useSetSorteringIkkeEndret = () => {
    const setEndret = useSetAtom(sorteringEndret);
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
    const setSorteringEndret = useSetAtom(sorteringEndret);
    return (sort: SortState, setSort: (state: SortState) => void, sortKey: SortKey) => {
        const sortState = {
            orderBy: sortKey,
            direction: sort.direction === 'descending' ? 'ascending' : 'descending',
        } as SortState;

        setSort(sortState);
        setSorteringEndret(true);
    };
};

const dateSortKey = atomWithStorage<SortKey>('dateSortKey', SortKey.Opprettet);
export const useDateSortState = () => useAtom(dateSortKey);
export const useDateSortValue = () => useAtomValue(dateSortKey);

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

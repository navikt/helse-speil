import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { TabType, tabState } from '../../Tabs';

export type SortationState = 'ascending' | 'descending' | 'none';

export type Sortation<T> = {
    sortKey: string;
    function: (a: T, b: T) => number;
    state: SortationState;
};

type SortationPerTab = { [key in TabType]: Sortation<OppgaveForOversiktsvisning> };

const defaultSortation: Sortation<OppgaveForOversiktsvisning> = {
    sortKey: 'no sort key',
    function: () => 0,
    state: 'none',
};
const sortationPerTab = atom<SortationPerTab>({
    key: 'sortationsPerTab',
    default: {
        [TabType.TilGodkjenning]: defaultSortation,
        [TabType.Mine]: defaultSortation,
        [TabType.Ventende]: defaultSortation,
        [TabType.BehandletIdag]: defaultSortation,
    },
});

const sortation = selector<Sortation<OppgaveForOversiktsvisning>>({
    key: 'sortation',
    get: ({ get }) => {
        const tab = get(tabState);
        return get(sortationPerTab)[tab];
    },
    set: ({ get, set }, newValue) => {
        const tab = get(tabState);
        set(sortationPerTab, (sortation) => ({ ...sortation, [tab]: newValue }));
    },
});

export const useSortation = () => useRecoilValue(sortation);

export const useSetSortation = () => useSetRecoilState(sortation);

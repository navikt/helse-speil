import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { TabType, tabState } from '../../Tabs';

export type SortationState = 'ascending' | 'descending' | 'none';

export type Sortation<T> = {
    label: string;
    function: (a: T, b: T) => number;
    state: SortationState;
};

type SortationPerTab = { [key in TabType]: Sortation<OppgaveForOversiktsvisning> | null };

const sortationPerTab = atom<SortationPerTab>({
    key: 'sortationsPerTab',
    default: {
        [TabType.TilGodkjenning]: null,
        [TabType.Mine]: null,
        [TabType.Ventende]: null,
        [TabType.BehandletIdag]: null,
    },
});

const sortation = selector<Sortation<OppgaveForOversiktsvisning> | null>({
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

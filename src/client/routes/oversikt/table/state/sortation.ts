import { Oppgave } from 'internal-types';
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { tabState, TabType } from '../../tabs';

export type SortationState = 'ascending' | 'descending' | 'none';

type Sortation<T> = {
    label: string;
    function: (a: T, b: T) => number;
    state: SortationState;
};

type SortationPerTab = { [key in TabType]: Sortation<Oppgave> | null };

const sortationPerTab = atom<SortationPerTab>({
    key: 'sortationsPerTab',
    default: {
        [TabType.TilGodkjenning]: null,
        [TabType.Mine]: null,
        [TabType.Ventende]: null,
    },
});

const sortation = selector<Sortation<Oppgave> | null>({
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

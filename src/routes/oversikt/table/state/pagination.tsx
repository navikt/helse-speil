import { atom, useAtom, useAtomValue } from 'jotai';

import { TabType, tabState } from '@oversikt/tabState';
import { atomWithSessionStorage } from '@state/jotai';

export const limit = 14;

export const offset = (page: number) => limit * (page - 1);

type TabPageState = { hash: string; page: number };
type CurrentPagePerTab = { [key in TabType]: TabPageState };

const currentPagePerTab = atomWithSessionStorage<CurrentPagePerTab>('currentPagePerTab', {
    [TabType.TilGodkjenning]: { hash: '', page: 1 },
    [TabType.Mine]: { hash: '', page: 1 },
    [TabType.Ventende]: { hash: '', page: 1 },
    [TabType.BehandletIdag]: { hash: '', page: 1 },
});

const pagination = atom(
    (get) => get(currentPagePerTab)[get(tabState)],
    (get, set, newValue: TabPageState) =>
        set(currentPagePerTab, (prevState) => ({ ...prevState, [get(tabState)]: newValue })),
);

export const useResetToFirstPageOnHashChange = () => {
    const [pageState, setPageState] = useAtom(pagination);

    return (hash: string) => {
        if (hash !== pageState.hash) setPageState({ hash: hash, page: 1 });
    };
};

export const useCurrentPageState: () => [number, (newValue: number) => void] = () => {
    const [value, setValue] = useAtom(pagination);
    const setPage = (page: number) => setValue({ hash: value.hash, page: page });

    return [value.page, setPage];
};

export const useCurrentPageValue = () => useAtomValue(pagination).page;

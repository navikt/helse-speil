import { atom, useAtom, useAtomValue } from 'jotai';

import { TabType, tabState } from '@oversikt/tabState';
import { atomWithSessionStorage } from '@state/jotai';

export const limit = 14;

export const offset = (page: number) => limit * (page - 1);

type TabPageState = { hash: string; page: number };
type CurrentPagePerTab = { [key in TabType]: TabPageState };

const defaultPageState: TabPageState = { hash: '', page: 1 };

const currentPagePerTab = atomWithSessionStorage<CurrentPagePerTab>('currentPagePerTab', {
    [TabType.TilGodkjenning]: defaultPageState,
    [TabType.Mine]: defaultPageState,
    [TabType.Ventende]: defaultPageState,
    [TabType.BehandletIdag]: defaultPageState,
    [TabType.Liste]: defaultPageState,
});

const pagination = atom(
    (get) => get(currentPagePerTab)[get(tabState)] ?? defaultPageState,
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

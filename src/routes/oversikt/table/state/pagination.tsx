import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

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
    [TabType.Dialogmelding]: defaultPageState,
    [TabType.Oppgavelister]: defaultPageState,
});

const pagination = atom(
    (get) => get(currentPagePerTab)[get(tabState)] ?? defaultPageState,
    (get, set, newValue: TabPageState) =>
        set(currentPagePerTab, (prevState) => ({ ...prevState, [get(tabState)]: newValue })),
);

const resetToFirstPageOnHashChange = atom(null, (get, set, tab: TabType, hash: string) => {
    const pageState = get(currentPagePerTab)[tab] ?? defaultPageState;
    if (hash !== pageState.hash) set(currentPagePerTab, (prevState) => ({ ...prevState, [tab]: { hash, page: 1 } }));
});

// Fanen sendes inn eksplisitt, slik at hashen alltid lagres på fanen variablene ble regnet ut for
export const useResetToFirstPageOnHashChange = () => useSetAtom(resetToFirstPageOnHashChange);

export const useCurrentPageState: () => [number, (newValue: number) => void] = () => {
    const [value, setValue] = useAtom(pagination);
    const setPage = (page: number) => setValue({ hash: value.hash, page: page });

    return [value.page, setPage];
};

export const useCurrentPageValue = () => useAtomValue(pagination).page;

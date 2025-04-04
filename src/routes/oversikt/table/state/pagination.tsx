import { atom, useAtom, useAtomValue } from 'jotai/index';

import { TabType, tabState } from '@oversikt/tabState';
import { atomWithSessionStorage } from '@state/jotai';

export const limit = 14;

export const offset = (page: number) => limit * (page - 1);

type CurrentPagePerTab = { [key in TabType]: number };

const currentPagePerTab = atomWithSessionStorage<CurrentPagePerTab>('currentPagePerTab', {
    [TabType.TilGodkjenning]: 1,
    [TabType.Mine]: 1,
    [TabType.Ventende]: 1,
    [TabType.BehandletIdag]: 1,
});

const pagination = atom(
    (get) => get(currentPagePerTab)[get(tabState)],
    (get, set, newValue: number) =>
        set(currentPagePerTab, (prevState) => ({ ...prevState, [get(tabState)]: newValue })),
);

export const useCurrentPageState = () => useAtom(pagination);
export const useCurrentPageValue = () => useAtomValue(pagination);

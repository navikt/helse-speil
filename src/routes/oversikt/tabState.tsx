import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import { atomWithSessionStorage } from '@state/jotai';

export enum TabType {
    TilGodkjenning = 'alle',
    Mine = 'mine',
    Ventende = 'ventende',
    BehandletIdag = 'behandletIdag',
}

export const tabState = atomWithSessionStorage<TabType>('tabState', TabType.TilGodkjenning);

export const tabEndret = atom(false);

export const useTabEndret = () => useAtomValue(tabEndret);
export const useSetTabIkkeEndret = () => {
    const setState = useSetAtom(tabEndret);
    return () => setState(false);
};

export const useAktivTab = () => useAtomValue(tabState);

export const useSwitchTab = (): [aktivTab: TabType, setAktivTab: (tab: TabType) => void] => {
    const [aktivTab, setAktivTab] = useAtom(tabState);
    const setTabEndret = useSetAtom(tabEndret);
    return [
        aktivTab,
        (tab: TabType) => {
            setAktivTab(tab);
            setTabEndret(true);
        },
    ];
};

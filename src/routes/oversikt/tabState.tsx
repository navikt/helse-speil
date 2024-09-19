import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { sessionStorageEffect } from '@state/effects/sessionStorageEffect';

export enum TabType {
    TilGodkjenning = 'alle',
    Mine = 'mine',
    Ventende = 'ventende',
    BehandletIdag = 'behandletIdag',
}

export const tabState = atom<TabType>({
    key: 'tabState',
    default: TabType.TilGodkjenning,
    effects: [sessionStorageEffect()],
});

export const tabEndret = atom<boolean>({
    key: 'tabEndret',
    default: false,
});

export const useTabEndret = () => useRecoilValue(tabEndret);
export const useSetTabIkkeEndret = () => {
    const setState = useSetRecoilState(tabEndret);
    return () => setState(false);
};

export const useAktivTab = (): TabType => useRecoilValue(tabState);

export const useSwitchTab = (): [aktivTab: TabType, setAktivTab: (tab: TabType) => void] => {
    const [aktivTab, setAktivTab] = useRecoilState(tabState);
    const setTabEndret = useSetRecoilState(tabEndret);
    return [
        aktivTab,
        (tab: TabType) => {
            setAktivTab(tab);
            setTabEndret(true);
        },
    ];
};

import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atom as recoilAtom, useRecoilState, useRecoilValue } from 'recoil';

import { sessionStorageEffect } from '@state/effects/sessionStorageEffect';

export enum TabType {
    TilGodkjenning = 'alle',
    Mine = 'mine',
    Ventende = 'ventende',
    BehandletIdag = 'behandletIdag',
}

export const tabState = recoilAtom<TabType>({
    key: 'tabState',
    default: TabType.TilGodkjenning,
    effects: [sessionStorageEffect()],
});

export const tabEndret = atom(false);

export const useTabEndret = () => useAtomValue(tabEndret);
export const useSetTabIkkeEndret = () => {
    const setState = useSetAtom(tabEndret);
    return () => setState(false);
};

export const useAktivTab = (): TabType => useRecoilValue(tabState);

export const useSwitchTab = (): [aktivTab: TabType, setAktivTab: (tab: TabType) => void] => {
    const [aktivTab, setAktivTab] = useRecoilState(tabState);
    const setTabEndret = useSetAtom(tabEndret);
    return [
        aktivTab,
        (tab: TabType) => {
            setAktivTab(tab);
            setTabEndret(true);
        },
    ];
};

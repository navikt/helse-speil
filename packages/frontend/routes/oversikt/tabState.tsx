import { atom, useRecoilValue } from 'recoil';

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
export const useAktivTab = () => useRecoilValue(tabState);

import { useAtom, useAtomValue } from 'jotai';

import { atomWithSessionStorage } from '@state/jotai';

export enum TabType {
    TilGodkjenning = 'alle',
    Mine = 'mine',
    Ventende = 'ventende',
    BehandletIdag = 'behandletIdag',
}

export const tabState = atomWithSessionStorage<TabType>('tabState', TabType.TilGodkjenning);

export const useAktivTab = () => useAtomValue(tabState);
export const useTabState = () => useAtom(tabState);

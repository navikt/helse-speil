import { useAtom, useAtomValue } from 'jotai';

import { atomWithSessionStorage } from '@state/jotai';

export enum TabType {
    TilGodkjenning = 'alle',
    Mine = 'mine',
    Ventende = 'ventende',
    BehandletIdag = 'behandletIdag',
    Dialogmelding = 'dialogmelding',
    Oppgavelister = 'oppgavelister',
}

export const tabState = atomWithSessionStorage<TabType>('tabState', TabType.TilGodkjenning, false);

export const useAktivTab = () => useAtomValue(tabState);
export const useTabState = () => useAtom(tabState);

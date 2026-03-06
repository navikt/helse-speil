import type { WritableAtom } from 'jotai';
import { useAtom, useAtomValue } from 'jotai';
import type { SetStateAction } from 'react';

import { erUtvikling } from '@/env';
import { atomWithSessionStorage } from '@state/jotai';

export type ToggleState = {
    kanBeslutteEgne: boolean;
    nyInngangsvilkår: boolean;
    nyBehandlendeEnhet: boolean;
};

const defaultToggleState: ToggleState = {
    kanBeslutteEgne: false,
    nyInngangsvilkår: false,
    nyBehandlendeEnhet: false,
};

const toggleState = atomWithSessionStorage<ToggleState>('toggleState', defaultToggleState);

export function hydrateToggleState(): [WritableAtom<ToggleState, [SetStateAction<ToggleState>], void>, ToggleState] {
    const sessionStorageState = sessionStorage.getItem('toggleState');

    return [
        toggleState,
        sessionStorageState && erUtvikling ? JSON.parse(sessionStorageState) : { ...defaultToggleState },
    ];
}

export const useToggle = (): { value: ToggleState; toggle: (property: keyof ToggleState) => () => void } => {
    const [toggleStateValue, setToggleState] = useAtom(toggleState);

    return {
        value: toggleStateValue,
        toggle: (property: keyof ToggleState) => () =>
            setToggleState((prevState) => ({
                ...prevState,
                [property]: !prevState[property],
            })),
    };
};

export const useKanBeslutteEgneOppgaver = (): boolean => useAtomValue(toggleState).kanBeslutteEgne;

export const useKanSeNyInngangsvilkår = (): boolean => useAtomValue(toggleState).nyInngangsvilkår;

export const useNyBehandlendeEnhet = (): boolean => useAtomValue(toggleState).nyBehandlendeEnhet;

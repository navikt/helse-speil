import type { WritableAtom } from 'jotai';
import { useAtom, useAtomValue } from 'jotai';
import type { SetStateAction } from 'react';

import { erUtvikling } from '@/env';
import { atomWithLocalStorage, atomWithSessionStorage } from '@state/jotai';

export type ToggleState = {
    kanBeslutteEgne: boolean;
    utviklersnacks: boolean;
};

type SessionToggleState = Omit<ToggleState, 'utviklersnacks'>;

const defaultToggleState: SessionToggleState = {
    kanBeslutteEgne: false,
};

const toggleState = atomWithSessionStorage<SessionToggleState>('toggleState', defaultToggleState);

const utviklersnacksState = atomWithLocalStorage<boolean>('utviklersnacks', false);

export function hydrateToggleState(): [
    WritableAtom<SessionToggleState, [SetStateAction<SessionToggleState>], void>,
    SessionToggleState,
] {
    const sessionStorageState = sessionStorage.getItem('toggleState');

    return [
        toggleState,
        sessionStorageState && erUtvikling
            ? { ...defaultToggleState, ...JSON.parse(sessionStorageState) }
            : { ...defaultToggleState },
    ];
}

export const useToggle = (): { value: ToggleState; toggle: (property: keyof ToggleState) => () => void } => {
    const [toggleStateValue, setToggleState] = useAtom(toggleState);
    const [utviklersnacks, setUtviklersnacks] = useAtom(utviklersnacksState);

    return {
        value: { ...toggleStateValue, utviklersnacks },
        toggle: (property: keyof ToggleState) => () => {
            if (property === 'utviklersnacks') {
                setUtviklersnacks((prev) => !prev);
                return;
            }
            setToggleState((prevState) => ({
                ...prevState,
                [property]: !prevState[property],
            }));
        },
    };
};

export const useKanBeslutteEgneOppgaver = (): boolean => useAtomValue(toggleState).kanBeslutteEgne;

export const useUtviklersnacks = (): boolean => useAtomValue(utviklersnacksState);

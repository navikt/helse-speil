import { useAtom, useAtomValue } from 'jotai';
import type { WritableAtom } from 'jotai/index';
import type { SetStateAction } from 'react';

import { erUtvikling } from '@/env';
import { atomWithSessionStorage } from '@state/jotai';
import { harBeslutterrolle, kanFrigiAndresOppgaver } from '@utils/featureToggles';

// Totrinnsvurdering
export type TotrinnsvurderingState = {
    harBeslutterrolle: boolean;
    kanBeslutteEgne: boolean;
};

const defaultTotrinnsvurderingState: TotrinnsvurderingState = {
    harBeslutterrolle: false,
    kanBeslutteEgne: false,
};

const totrinnsvurderingState = atomWithSessionStorage<TotrinnsvurderingState>(
    'totrinnsvurderingState',
    defaultTotrinnsvurderingState,
);

export function hydrateTotrinnsvurderingState(
    brukerRoller: string[],
): [WritableAtom<TotrinnsvurderingState, [SetStateAction<TotrinnsvurderingState>], void>, TotrinnsvurderingState] {
    const sessionStorageState = typeof window !== 'undefined' ? sessionStorage.getItem('totrinnsvurderingState') : null;

    return [
        totrinnsvurderingState,
        sessionStorageState && erUtvikling
            ? JSON.parse(sessionStorageState)
            : { ...defaultTotrinnsvurderingState, harBeslutterrolle: harBeslutterrolle(brukerRoller) },
    ];
}

export const useTotrinnsvurdering = (): [
    value: TotrinnsvurderingState,
    toggle: (property: keyof TotrinnsvurderingState) => () => void,
] => {
    const [totrinnsvurdering, setTotrinnsvurdering] = useAtom(totrinnsvurderingState);

    return [
        totrinnsvurdering,
        (property: keyof TotrinnsvurderingState) => () =>
            setTotrinnsvurdering((prevState) => ({
                ...prevState,
                [property]: !prevState[property],
            })),
    ];
};

export const useHarBeslutterrolle = (): boolean => {
    return useTotrinnsvurdering()[0]?.harBeslutterrolle;
};

export const useKanBeslutteEgneOppgaver = (): boolean => {
    return useTotrinnsvurdering()[0]?.kanBeslutteEgne;
};

// Tildeling
const kanFrigiOppgaverState = atomWithSessionStorage('kanFrigiOppgaverState', false);

export function hydrateKanFrigiOppgaverState(
    ident: string,
): [WritableAtom<boolean, [SetStateAction<boolean>], void>, boolean] {
    const sessionStorageState = typeof window !== 'undefined' ? sessionStorage.getItem('kanFrigiOppgaverState') : null;
    return [
        kanFrigiOppgaverState,
        erUtvikling && sessionStorageState ? JSON.parse(sessionStorageState) : kanFrigiAndresOppgaver(ident),
    ];
}

export const useKanFrigiOppgaver = (): boolean => {
    return useAtomValue(kanFrigiOppgaverState);
};

export const useToggleKanFrigiOppgaver = (): [value: boolean, toggle: () => void] => {
    const [kanFrigiOppgaver, setKanFrigiOppgaver] = useAtom(kanFrigiOppgaverState);

    return [kanFrigiOppgaver, () => setKanFrigiOppgaver((prevState) => !prevState)];
};

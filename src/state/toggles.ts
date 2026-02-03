import { useAtom } from 'jotai';
import type { WritableAtom } from 'jotai/index';
import type { SetStateAction } from 'react';

import { erUtvikling } from '@/env';
import { atomWithSessionStorage } from '@state/jotai';

// Totrinnsvurdering
export type TotrinnsvurderingState = {
    kanBeslutteEgne: boolean;
};

const defaultTotrinnsvurderingState: TotrinnsvurderingState = {
    kanBeslutteEgne: false,
};

const totrinnsvurderingState = atomWithSessionStorage<TotrinnsvurderingState>(
    'totrinnsvurderingState',
    defaultTotrinnsvurderingState,
);

export function hydrateTotrinnsvurderingState(): [
    WritableAtom<TotrinnsvurderingState, [SetStateAction<TotrinnsvurderingState>], void>,
    TotrinnsvurderingState,
] {
    const sessionStorageState = sessionStorage.getItem('totrinnsvurderingState');

    return [
        totrinnsvurderingState,
        sessionStorageState && erUtvikling ? JSON.parse(sessionStorageState) : { ...defaultTotrinnsvurderingState },
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

export const useKanBeslutteEgneOppgaver = (): boolean => {
    return useTotrinnsvurdering()[0]?.kanBeslutteEgne;
};

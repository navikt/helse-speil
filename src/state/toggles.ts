import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { SetRecoilState, atom, useRecoilState } from 'recoil';

import { sessionStorageEffect } from '@state/effects/sessionStorageEffect';
import { atomWithSessionStorage } from '@state/jotai';
import { harBeslutterrolle, kanFrigiAndresOppgaver } from '@utils/featureToggles';

// Totrinnsvurdering
export type TotrinnsvurderingState = {
    erAktiv: boolean;
    harBeslutterrolle: boolean;
    kanBeslutteEgne: boolean;
};

const totrinnsvurderingState = atom<TotrinnsvurderingState>({
    key: 'totrinnsvurderingState',
    default: {
        erAktiv: true,
        harBeslutterrolle: false,
        kanBeslutteEgne: false,
    },
    effects: [sessionStorageEffect()],
});

export const hydrateTotrinnsvurderingState = (set: SetRecoilState, brukerRoller: string[]) => {
    set(totrinnsvurderingState, (prevState) => ({
        ...prevState,
        harBeslutterrolle: harBeslutterrolle(brukerRoller),
    }));
};

export const useTotrinnsvurdering = (): [
    value: TotrinnsvurderingState,
    toggle: (property: keyof TotrinnsvurderingState) => () => void,
] => {
    const [totrinnsvurdering, setTotrinnsvurdering] = useRecoilState(totrinnsvurderingState);

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

export const useTotrinnsvurderingErAktiv = (): boolean => {
    return useTotrinnsvurdering()[0]?.erAktiv;
};

export const useKanBeslutteEgneOppgaver = (): boolean => {
    return useTotrinnsvurdering()[0]?.kanBeslutteEgne;
};

// Tildeling
const kanFrigiOppgaverState = atomWithSessionStorage('kanFrigiOppgaverState', false);

export const useHydrateKanFrigiOppgaverState = (ident: string) => {
    const setKanFrigiOppgaverState = useSetAtom(kanFrigiOppgaverState);
    useEffect(() => {
        setKanFrigiOppgaverState(kanFrigiAndresOppgaver(ident));
    }, [ident, setKanFrigiOppgaverState]);
};

export const useKanFrigiOppgaver = (): boolean => {
    return useAtomValue(kanFrigiOppgaverState);
};

export const useToggleKanFrigiOppgaver = (): [value: boolean, toggle: () => void] => {
    const [kanFrigiOppgaver, setKanFrigiOppgaver] = useAtom(kanFrigiOppgaverState);

    return [kanFrigiOppgaver, () => setKanFrigiOppgaver((prevState) => !prevState)];
};

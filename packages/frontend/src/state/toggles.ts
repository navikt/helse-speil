import { SetRecoilState, atom, useRecoilState, useRecoilValue } from 'recoil';

import { sessionStorageEffect } from '@state/effects/sessionStorageEffect';
import { harBeslutterrolle, kanFrigiAndresOppgaver } from '@utils/featureToggles';

// Totrinnsvurdering
type TotrinnsvurderingState = {
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
    return useTotrinnsvurdering()[0].harBeslutterrolle;
};

export const useTotrinnsvurderingErAktiv = (): boolean => {
    return useTotrinnsvurdering()[0].erAktiv;
};

export const useKanBeslutteEgneOppgaver = (): boolean => {
    return useTotrinnsvurdering()[0].kanBeslutteEgne;
};

// Tildeling
const kanFrigiOppgaverState = atom<boolean>({
    key: 'kanFrigiOppgaverState',
    default: false,
    effects: [sessionStorageEffect()],
});

export const hydrateKanFrigiOppgaverState = (set: SetRecoilState, ident: string) => {
    set(kanFrigiOppgaverState, kanFrigiAndresOppgaver(ident));
};

export const useKanFrigiOppgaver = (): boolean => {
    return useRecoilValue(kanFrigiOppgaverState);
};

export const useToggleKanFrigiOppgaver = (): [value: boolean, toggle: () => void] => {
    const [kanFrigiOppgaver, setKanFrigiOppgaver] = useRecoilState(kanFrigiOppgaverState);

    return [kanFrigiOppgaver, () => setKanFrigiOppgaver((prevState) => !prevState)];
};

// Read only
type ReadonlyState = {
    value: boolean;
    override: boolean;
};

const readonlyState = atom<ReadonlyState>({
    key: 'readonlyState',
    default: {
        value: false,
        override: false,
    },
    effects: [sessionStorageEffect()],
});

export const useReadonly = (): ReadonlyState => {
    return useRecoilValue(readonlyState);
};

export const useToggleReadonly = (): [value: ReadonlyState, toggleValue: () => void, toggleOverride: () => void] => {
    const [readonly, setReadonly] = useRecoilState(readonlyState);

    const toggleValue = (): void => {
        if (readonly.override) {
            setReadonly((prevState) => ({ ...prevState, value: !prevState.value }));
        }
    };

    const toggleOverride = (): void => {
        setReadonly((prevState) => ({ ...prevState, override: !prevState.override }));
    };

    return [readonly, toggleValue, toggleOverride];
};

import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
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
        harBeslutterrolle: harBeslutterrolle,
        kanBeslutteEgne: false,
    },
});

export const useTotrinnsvurdering = (): TotrinnsvurderingState => {
    return useRecoilValue(totrinnsvurderingState);
};

export const useToggleTotrinnsvurdering = (): ((property: keyof TotrinnsvurderingState) => () => void) => {
    const setTotrinnsvurderingState = useSetRecoilState(totrinnsvurderingState);

    return (property: keyof TotrinnsvurderingState) => () => {
        setTotrinnsvurderingState((prevState) => ({
            ...prevState,
            [property]: !prevState[property],
        }));
    };
};

export const useHarBeslutterrolle = (): boolean => {
    return useTotrinnsvurdering().harBeslutterrolle;
};

export const useTotrinnsvurderingErAktiv = (): boolean => {
    return useTotrinnsvurdering().erAktiv;
};

export const useKanBeslutteEgneOppgaver = (): boolean => {
    return useTotrinnsvurdering().kanBeslutteEgne;
};

// Tildeling
const kanFrigiOppgaverState = atom<boolean>({
    key: 'kanFrigiOppgaverState',
    default: kanFrigiAndresOppgaver,
});

export const useKanFrigiOppgaver = (): boolean => {
    return useRecoilValue(kanFrigiOppgaverState);
};

export const useToggleKanFrigiOppgaver = (): [value: boolean, toggle: () => void] => {
    const [kanFrigiOppgaver, setKanFrigiOppgaver] = useRecoilState(kanFrigiOppgaverState);

    return [kanFrigiOppgaver, () => setKanFrigiOppgaver((prevState) => !prevState)];
};

// Read only
const readonlyOverrideState = atom<boolean>({
    key: 'readonlyOverrideState',
    default: false,
});

export const useReadonlyOverride = (): boolean => {
    return useRecoilValue(readonlyOverrideState);
};

export const useToggleReadonlyOverride = (): [value: boolean, toggle: () => void] => {
    const [readonlyOverride, setReadonlyOverride] = useRecoilState(readonlyOverrideState);

    return [readonlyOverride, () => setReadonlyOverride((prevState) => !prevState)];
};

const readonlyState = atom<boolean>({
    key: 'readonlyState',
    default: false,
});

export const useReadonly = (): boolean => {
    return useRecoilValue(readonlyState);
};

export const useToggleReadonly = (): [value: boolean, toggle: () => void] => {
    const [readonly, setReadonly] = useRecoilState(readonlyState);

    return [readonly, () => setReadonly((prevState) => !prevState)];
};

// Revurdering
export const skalSjekkeRevurderingForTotrinnState = atom<boolean>({
    key: 'skalSjekkeRevurderingForTotrinnState',
    default: true,
});

export const useSkalSjekkeRevurderingForTotrinn = (): boolean => {
    return useRecoilValue(skalSjekkeRevurderingForTotrinnState);
};

export const useToggleSkalSjekkeRevurderingForTotrinn = (): [value: boolean, toggle: () => void] => {
    const [skalSjekkeRevurdering, setSkalSjekkeRevurdering] = useRecoilState(skalSjekkeRevurderingForTotrinnState);

    return [skalSjekkeRevurdering, () => setSkalSjekkeRevurdering((prevState) => !prevState)];
};

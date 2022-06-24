import { atom } from 'recoil';
import { harBeslutterRolle, kanFrigiAndresOppgaver, totrinnsvurderingAktiv } from '@utils/featureToggles';

// Totrinnsvurdering
export const toggleHarBeslutterRolle = atom<boolean>({
    key: 'toggleHarBeslutterRolle',
    default: harBeslutterRolle,
});

export const toggleTotrinnsvurderingAktiv = atom<boolean>({
    key: 'toggleTotrinnsvurderingAktiv',
    default: totrinnsvurderingAktiv,
});

export const toggleKanBeslutteEgenBeslutteroppgave = atom<boolean>({
    key: 'toggleKanBeslutteEgenBeslutteroppgave',
    default: false,
});

// Tildeling
export const toggleKanFrigiAndresOppgaver = atom<boolean>({
    key: 'toggleKanFrigiAndresOppgaver',
    default: kanFrigiAndresOppgaver,
});

// Read only
export const toggleReadOnlyOverride = atom<boolean>({
    key: 'toggleReadOnlyOverride',
    default: false,
});

export const toggleReadOnly = atom<boolean>({
    key: 'toggleReadOnly',
    default: false,
});

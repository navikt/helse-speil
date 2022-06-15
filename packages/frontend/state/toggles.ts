import { atom } from 'recoil';
import {
    beslutteroppgaveAktiv,
    harBeslutterRolle,
    kanBeslutteEgenBeslutteroppgave,
    kanFrigiAndresOppgaver,
    totrinnsvurderingAktiv,
} from '@utils/featureToggles';

// Totrinnstoggles
export const toggleHarBeslutterRolle = atom<boolean>({
    key: 'toggleHarBeslutterRolle',
    default: harBeslutterRolle,
});

export const toggleTotrinnsvurderingAktiv = atom<boolean>({
    key: 'toggleTotrinnsvurderingAktiv',
    default: totrinnsvurderingAktiv,
});

export const toggleBeslutteroppgaveAktiv = atom<boolean>({
    key: 'toggleBeslutteroppgaveAktiv',
    default: beslutteroppgaveAktiv,
});

export const toggleKanBeslutteEgenBeslutteroppgave = atom<boolean>({
    key: 'toggleKanBeslutteEgenBeslutteroppgave',
    default: kanBeslutteEgenBeslutteroppgave,
});

// Tildeling
export const toggleKanFrigiAndresOppgaver = atom<boolean>({
    key: 'toggleKanFrigiAndresOppgaver',
    default: kanFrigiAndresOppgaver,
});

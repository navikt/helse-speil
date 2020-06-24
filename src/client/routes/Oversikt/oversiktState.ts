import { atom } from 'recoil';
import { Oppgave } from '../../../types';

export type Oppgavefilter = (oppgave: Oppgave) => boolean;

export type Oppgavesortering = (a: Oppgave, b: Oppgave) => number;

export const aktiveFiltereState = atom<Oppgavefilter[]>({
    key: 'aktiveFiltere',
    default: [],
});

export const ascendingOpprettet = (a: Oppgave, b: Oppgave) =>
    new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime();

export const descendingOpprettet = (a: Oppgave, b: Oppgave) =>
    new Date(b.opprettet).getTime() - new Date(a.opprettet).getTime();

export const aktivSortering = atom<Oppgavesortering | undefined>({
    key: 'aktivSortering',
    default: descendingOpprettet,
});

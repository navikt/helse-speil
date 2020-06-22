import { atom } from 'recoil';
import { Oppgavefilter } from './Oversikt';

export const aktiveFiltereState = atom<Oppgavefilter[]>({
    key: 'aktiveFiltere',
    default: [],
});

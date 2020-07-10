import { atom, selector } from 'recoil';
import { Oppgave } from '../../../types';
import { SpeilOppgave } from './Oversiktslinje';

export type Oppgavefilter = (oppgave: Oppgave) => boolean;

export const aktiveFiltereState = atom<Oppgavefilter[]>({
    key: 'aktiveFiltere',
    default: [],
});

export const aktivSorteringState = selector({
    key: 'aktivSortering',
    get: ({ get }) => {
        const aktivKolonne = get(aktivKolonneState);
        const retning = get(sorteringsretningState);
        return aktivKolonne.sortering[retning];
    },
});

export type Retning = 'ascending' | 'descending';

export const sorteringsretningState = atom<Retning>({
    key: 'sorteringsretning',
    default: 'ascending',
});

type Oppgavesortering = (a: any, b: any) => number;

const sorterePåOpprettet = (a: Oppgave, b: Oppgave) =>
    new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime();

const sorterePåTildelt = (a: SpeilOppgave, b: SpeilOppgave) =>
    a.tildeltTil ? (b.tildeltTil ? a.tildeltTil.localeCompare(b.tildeltTil, 'nb-NO') : -1) : b.tildeltTil ? 1 : 0;

const sorterePåBokommune = (a: Oppgave, b: Oppgave) => a.boenhet.navn.localeCompare(b.boenhet.navn, 'nb-NO');

export type SorterbarKolonne = {
    sortering: {
        ascending: Oppgavesortering;
        descending: Oppgavesortering;
    };
    initiellRetning: Retning;
};

type SorterbareKolonner = {
    opprettet: SorterbarKolonne;
    tildelt: SorterbarKolonne;
    bokommune: SorterbarKolonne;
};

export const sorterbareKolonner: SorterbareKolonner = {
    opprettet: {
        sortering: {
            ascending: sorterePåOpprettet,
            descending: (a: Oppgave, b: Oppgave) => sorterePåOpprettet(b, a),
        },
        initiellRetning: 'descending',
    },
    tildelt: {
        sortering: {
            ascending: sorterePåTildelt,
            descending: (a: SpeilOppgave, b: SpeilOppgave) => sorterePåTildelt(b, a),
        },
        initiellRetning: 'ascending',
    },
    bokommune: {
        sortering: {
            ascending: sorterePåBokommune,
            descending: (a: SpeilOppgave, b: SpeilOppgave) => sorterePåBokommune(b, a),
        },
        initiellRetning: 'ascending',
    },
};

export const aktivKolonneState = atom<SorterbarKolonne>({
    key: 'aktivKolonne',
    default: sorterbareKolonner.opprettet,
});

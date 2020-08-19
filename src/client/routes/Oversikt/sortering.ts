import { Oppgave, OppgaveType } from '../../../types';

export const sorterTall = (a: number, b: number) => a - b;

export const sorterDateString = (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime();

export const sorterTekstAlfabetisk = (a: string, b: string) => a.localeCompare(b, 'nb-NO');

export const sorterTildeltTil = (a: Oppgave, b: Oppgave) =>
    a.tildeltTil ? (b.tildeltTil ? a.tildeltTil.localeCompare(b.tildeltTil, 'nb-NO') : -1) : b.tildeltTil ? 1 : 0;

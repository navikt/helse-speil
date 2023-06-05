import { nanoid } from 'nanoid';

export const getDefaultOppgave = (): Oppgave => ({
    id: nanoid(),
    erPåVent: false,
    totrinnsvurdering: null,
});

export class OppgaveMock {
    private static oppgaver: Map<UUID, Oppgave> = new Map();

    static getOppgave = (oppgavereferanse: UUID): Oppgave | null => {
        return OppgaveMock.oppgaver.get(oppgavereferanse) ?? null;
    };

    static addOrUpdateOppgave = (oppgavereferanse: UUID, oppgave: Partial<Oppgave>): void => {
        OppgaveMock.oppgaver.set(oppgavereferanse, {
            ...getDefaultOppgave(),
            ...OppgaveMock.oppgaver.get(oppgavereferanse),
            ...oppgave,
        });
    };

    static isAssigned = (oppgavereferanse: string): boolean => {
        return typeof OppgaveMock.getOppgave(oppgavereferanse)?.tildelt !== 'undefined';
    };

    static isOnHold = (oppgavereferanse: string): boolean => {
        return OppgaveMock.getOppgave(oppgavereferanse)?.erPåVent ?? false;
    };
}

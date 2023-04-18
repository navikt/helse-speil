import { nanoid } from 'nanoid';

import { BeregnetPeriode } from '../schemaTypes';

export const getDefaultOppgave = (): Oppgave => ({
    id: nanoid(),
    erPåVent: false,
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

    static isAssigned = (period: BeregnetPeriode): boolean => {
        return (
            typeof period.oppgavereferanse === 'string' &&
            typeof OppgaveMock.getOppgave(period.oppgavereferanse)?.tildelt === 'string'
        );
    };

    static isOnHold = (period: BeregnetPeriode): boolean => {
        return (
            typeof period.oppgavereferanse === 'string' &&
            (OppgaveMock.getOppgave(period.oppgavereferanse)?.erPåVent ?? false)
        );
    };
}

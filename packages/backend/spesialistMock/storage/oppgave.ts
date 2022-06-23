import { BeregnetPeriode, Maybe } from '../schemaTypes';

export class OppgaveMock {
    private static oppgaver: Map<UUID, Oppgave> = new Map();

    static getOppgave = (oppgavereferanse: UUID): Oppgave | null => {
        return OppgaveMock.oppgaver.get(oppgavereferanse) ?? null;
    };

    static addOrUpdateOppgave = (oppgavereferanse: UUID, oppgave: Oppgave): void => {
        OppgaveMock.oppgaver.set(oppgavereferanse, {
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

    static isBeslutteroppgave = (period: BeregnetPeriode): boolean => {
        return (
            typeof period.oppgavereferanse === 'string' &&
            (OppgaveMock.getOppgave(period.oppgavereferanse)?.erBeslutter ?? false)
        );
    };

    static isReturoppgave = (period: BeregnetPeriode): boolean => {
        return (
            typeof period.oppgavereferanse === 'string' &&
            (OppgaveMock.getOppgave(period.oppgavereferanse)?.erRetur ?? false)
        );
    };

    static getTidligereSaksbehandlerOid = (period: BeregnetPeriode): Maybe<string> | undefined => {
        return period.oppgavereferanse
            ? OppgaveMock.getOppgave(period.oppgavereferanse)?.tidligereSaksbehandler ??
                  period.tidligereSaksbehandlerOid
            : period.tidligereSaksbehandlerOid;
    };
}

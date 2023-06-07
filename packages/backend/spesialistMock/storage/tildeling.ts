import { Tildeling } from '../schemaTypes';

export class TildelingMock {
    private static tildelinger: Map<string, Tildeling> = new Map();

    static getTildeling = (oppgaveId: string): Tildeling | undefined => TildelingMock.tildelinger.get(oppgaveId);

    static harTildeling = (oppgaveId: string): boolean => TildelingMock.tildelinger.has(oppgaveId);

    static setTildeling = (oppgaveId: string, tildeling: Tildeling) =>
        TildelingMock.tildelinger.set(oppgaveId, tildeling);

    static fjernTildeling = (oppgaveId: string) => TildelingMock.tildelinger.delete(oppgaveId);
}

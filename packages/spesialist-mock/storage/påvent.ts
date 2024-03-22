import { PaVent } from '../schemaTypes';

export class PaVentMock {
    private static lagtPåVent: Map<string, PaVent> = new Map();

    static getPåVentFor = (oid: string): PaVent[] =>
        Array.from(PaVentMock.lagtPåVent.values()).filter((påVent) => påVent.oid === oid);

    static getPåVent = (oppgaveId: string): PaVent | undefined => PaVentMock.lagtPåVent.get(oppgaveId);

    static erPåVent = (oppgaveId: string): boolean => PaVentMock.lagtPåVent.has(oppgaveId);

    static setPåVent = (oppgaveId: string, påVent: PaVent) => PaVentMock.lagtPåVent.set(oppgaveId, påVent);

    static fjernPåVent = (oppgaveId: string) => PaVentMock.lagtPåVent.delete(oppgaveId);
}

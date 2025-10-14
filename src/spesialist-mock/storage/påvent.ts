import { PaVent } from '../schemaTypes';

export class PaVentMock {
    private static lagtPåVent: Map<string, PaVent | null> = new Map();

    static getPåVentFor = (oid: string): PaVent[] =>
        Array.from(PaVentMock.lagtPåVent.values())
            .filter((påVent) => påVent !== null)
            .filter((påVent) => påVent.oid === oid);

    static getPåVent = (oppgaveId: string): PaVent | null | undefined => PaVentMock.lagtPåVent.get(oppgaveId);

    static finnesIMock = (oppgaveId: string): boolean => {
        const påVent = PaVentMock.lagtPåVent.get(oppgaveId);
        return påVent !== undefined;
    };

    static erPåVent = (oppgaveId: string): boolean => {
        const påVent = PaVentMock.lagtPåVent.get(oppgaveId);
        return !(påVent === undefined || påVent === null);
    };

    static setPåVent = (oppgaveId: string, påVent: PaVent) => PaVentMock.lagtPåVent.set(oppgaveId, påVent);

    static fjernPåVent = (oppgaveId: string) => PaVentMock.lagtPåVent.set(oppgaveId, null);
}

import { PaVent } from '../schemaTypes';

export class PaVentMock {
    private static lagtPåVent: Map<string, PaVent | null> = new Map();

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

    static nullstill = (): void => {
        PaVentMock.lagtPåVent.clear();
    };
}

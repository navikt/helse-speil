import { ApiPaVent } from '@io/rest/generated/spesialist.schemas';

export class PaVentMock {
    private static lagtPåVent: Map<string, ApiPaVent | null> = new Map();

    static getPåVent = (oppgaveId: string): ApiPaVent | null | undefined => PaVentMock.lagtPåVent.get(oppgaveId);

    static finnesIMock = (oppgaveId: string): boolean => {
        const påVent = PaVentMock.lagtPåVent.get(oppgaveId);
        return påVent !== undefined;
    };

    static erPåVent = (oppgaveId: string): boolean => {
        const påVent = PaVentMock.lagtPåVent.get(oppgaveId);
        return !(påVent === undefined || påVent === null);
    };

    static setPåVent = (oppgaveId: string, påVent: ApiPaVent) => PaVentMock.lagtPåVent.set(oppgaveId, påVent);

    static fjernPåVent = (oppgaveId: string) => PaVentMock.lagtPåVent.set(oppgaveId, null);

    static nullstill = (): void => {
        PaVentMock.lagtPåVent.clear();
    };
}

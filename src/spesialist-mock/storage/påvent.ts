import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { PaVent } from '../schemaTypes';

dayjs.extend(isSameOrBefore);

export class PaVentMock {
    private static lagtPåVent: Map<string, PaVent | null> = new Map();

    static getPåVentFor = (oid: string): PaVent[] =>
        Array.from(PaVentMock.lagtPåVent.values())
            .filter((påVent) => påVent !== null)
            .filter((påVent) => påVent.oid === oid);

    static getPåVentNåddFristFor = (oid: string): PaVent[] =>
        Array.from(PaVentMock.lagtPåVent.values())
            .filter((påVent) => påVent !== null)
            .filter((påVent) => påVent.oid === oid)
            .filter((påVent) => påVent.frist != null && dayjs(påVent.frist).isSameOrBefore(dayjs()));

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

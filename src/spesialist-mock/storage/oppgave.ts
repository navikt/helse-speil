import { Oppgave, UUID } from '@typer/spesialist-mock';
import { generateId } from '@utils/generateId';

export const getDefaultOppgave = (): Oppgave => ({
    id: generateId(),
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
}

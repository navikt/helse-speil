import { nanoid } from 'nanoid';

import { Maybe } from '@io/graphql';
import { Oppgave, UUID } from '@typer/spesialist-mock';

export const getDefaultOppgave = (): Oppgave => ({
    id: nanoid(),
    erPåVent: false,
    totrinnsvurdering: null,
});

export class OppgaveMock {
    private static oppgaver: Map<UUID, Oppgave> = new Map();

    static getOppgave = (oppgavereferanse: UUID): Maybe<Oppgave> => {
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

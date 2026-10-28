import { ApiAktivOppgave, ApiTotrinnsvurdering } from '@io/rest/generated/spesialist.schemas';
import { BehandlingMock } from '@spesialist-mock/storage/behandling';
import { lesTestpersonfiler } from '@spesialist-mock/storage/person';

type Oppgavedata = {
    aktivOppgave: ApiAktivOppgave | null;
    totrinnsvurdering: ApiTotrinnsvurdering | null;
};

// Feltene endres ikke i fila, så de leses bare én gang. Endringer ligger i BehandlingMock.
const oppgavedata: Map<string, Oppgavedata> = new Map(
    lesTestpersonfiler().map((fil) => [
        fil.saksbilde.fodselsnummer,
        { aktivOppgave: fil.aktivOppgave, totrinnsvurdering: fil.totrinnsvurdering },
    ]),
);

// Oppgaven fra testpersonfila, også når mocken har ferdigstilt den
export const finnOppgaveFraTestperson = (fødselsnummer: string): ApiAktivOppgave | null =>
    oppgavedata.get(fødselsnummer)?.aktivOppgave ?? null;

export const finnAktivOppgave = (fødselsnummer: string): ApiAktivOppgave | null => {
    const oppgave = finnOppgaveFraTestperson(fødselsnummer);
    if (!oppgave || BehandlingMock.erOppgaveFerdigstilt(oppgave.id)) return null;
    return oppgave;
};

export const finnTotrinnsvurdering = (fødselsnummer: string): ApiTotrinnsvurdering | null => {
    const data = oppgavedata.get(fødselsnummer);
    if (!data) return null;
    const endret = data.aktivOppgave ? BehandlingMock.getTotrinnsvurderingForOppgave(data.aktivOppgave.id) : undefined;
    return endret !== undefined ? endret : data.totrinnsvurdering;
};

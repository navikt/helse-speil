import { ApiAktivOppgave, ApiPaVent, ApiTildeling, ApiTotrinnsvurdering } from '@io/rest/generated/spesialist.schemas';
import { BehandlingMock } from '@spesialist-mock/storage/behandling';
import { PersonMock, lesTestpersonfiler } from '@spesialist-mock/storage/person';
import { PaVentMock } from '@spesialist-mock/storage/påvent';
import { TildelingMock } from '@spesialist-mock/storage/tildeling';

type Oppgavedata = {
    aktivOppgave: ApiAktivOppgave | null;
    totrinnsvurdering: ApiTotrinnsvurdering | null;
    tildeling: ApiTildeling | null;
    påVent: ApiPaVent | null;
};

// Feltene endres ikke i fila, så de leses bare én gang. Endringer ligger i BehandlingMock.
const oppgavedata: Map<string, Oppgavedata> = new Map(
    lesTestpersonfiler().map((fil) => [
        fil.saksbilde.fodselsnummer,
        {
            aktivOppgave: fil.aktivOppgave,
            totrinnsvurdering: fil.totrinnsvurdering,
            tildeling: fil.tildeling,
            påVent: fil.påVent,
        },
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

// Tildelingen i mocken gjelder bare så lenge personen har aktiv oppgave
export const finnTildeling = (fødselsnummer: string): ApiTildeling | null => {
    const pseudoId = PersonMock.findPersonPseudoId(fødselsnummer);
    if (pseudoId && finnAktivOppgave(fødselsnummer) && TildelingMock.harTildeling(pseudoId)) {
        return TildelingMock.getTildeling(pseudoId) ?? null;
    }
    return oppgavedata.get(fødselsnummer)?.tildeling ?? null;
};

// Som i spesialist: påVent gjelder bare den aktive oppgaven
export const finnPåVent = (fødselsnummer: string): ApiPaVent | null => {
    const oppgave = finnAktivOppgave(fødselsnummer);
    if (!oppgave) return null;
    if (PaVentMock.finnesIMock(oppgave.id)) return PaVentMock.getPåVent(oppgave.id) ?? null;
    return oppgavedata.get(fødselsnummer)?.påVent ?? null;
};

import { antallTilfeldigeOppgaver } from '../../devHelpers';
import { FiltreringInput, OppgaveTilBehandling, OppgaverTilBehandling, OppgavesorteringInput } from '../schemaTypes';
import { TildelingMock } from '../storage/tildeling';
import { oppgaver, tilfeldigeOppgaver } from './oppgaver';

export const oppgaveliste = (
    offset: number,
    limit: number,
    sortering: OppgavesorteringInput,
    filtrering: FiltreringInput,
): OppgaverTilBehandling => {
    const oppgaveliste = syncTildelingMock(oppgaver).concat(tilfeldigeOppgaver(antallTilfeldigeOppgaver));
    const filtrertListe = filtrer(oppgaveliste, filtrering);
    const sortertListe = sorter(filtrertListe, sortering);

    return {
        oppgaver: offset !== 0 ? sortertListe.slice(offset).slice(0, limit) : sortertListe.slice(0, limit),
        totaltAntallOppgaver: sortertListe.length,
    } as OppgaverTilBehandling;
};

const filtrer = (oppgaver: OppgaveTilBehandling[], filtrering: FiltreringInput): OppgaveTilBehandling[] => {
    if (filtrering.egneSaker) {
        return oppgaver.filter(
            (oppgave) =>
                oppgave.tildeling?.oid === '4577332e-801a-4c13-8a71-39f12b8abfa3' && !oppgave.tildeling?.paaVent,
        );
    }
    if (filtrering.egneSakerPaVent) {
        return oppgaver.filter(
            (oppgave) =>
                oppgave.tildeling?.oid === '4577332e-801a-4c13-8a71-39f12b8abfa3' && oppgave.tildeling?.paaVent,
        );
    }
    return oppgaver;
};

const sorter = (oppgaver: OppgaveTilBehandling[], sortering: OppgavesorteringInput): OppgaveTilBehandling[] => {
    return oppgaver;
};

const syncTildelingMock = (oppgaver: OppgaveTilBehandling[]) => {
    return oppgaver.map((oppgave) => {
        if (oppgave.tildeling !== undefined && oppgave.tildeling !== null && !TildelingMock.harTildeling(oppgave.id)) {
            TildelingMock.setTildeling(oppgave.id, oppgave.tildeling);
        }
        return {
            ...oppgave,
            tildeling: TildelingMock.getTildeling(oppgave.id),
        } as OppgaveTilBehandling;
    });
};

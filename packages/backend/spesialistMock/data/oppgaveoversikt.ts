import {
    FiltreringInput,
    Kategori,
    OppgaveTilBehandling,
    OppgaverTilBehandling,
    OppgavesorteringInput,
} from '../schemaTypes';
import { TildelingMock } from '../storage/tildeling';
import { oppgaver, tilfeldigeOppgaver } from './oppgaver';

export const oppgaveliste = (
    offset: number,
    limit: number,
    sortering: OppgavesorteringInput,
    filtrering: FiltreringInput,
): OppgaverTilBehandling => {
    const oppgaveliste = syncTildelingMock(oppgaver).concat(tilfeldigeOppgaver);
    const filtrertListe = filtrer(oppgaveliste, filtrering);
    const sortertListe = sorter(filtrertListe, sortering);

    return {
        oppgaver: offset !== 0 ? sortertListe.slice(offset).slice(0, limit) : sortertListe.slice(0, limit),
        totaltAntallOppgaver: sortertListe.length,
    } as OppgaverTilBehandling;
};

const filtrer = (oppgaver: OppgaveTilBehandling[], filtrering: FiltreringInput): OppgaveTilBehandling[] => {
    return oppgaver
        .filter((oppgave) =>
            filtrering.egneSaker
                ? oppgave.tildeling?.oid === '4577332e-801a-4c13-8a71-39f12b8abfa3' && !oppgave.tildeling?.paaVent
                : true,
        )
        .filter((oppgave) =>
            filtrering.egneSakerPaVent
                ? oppgave.tildeling?.oid === '4577332e-801a-4c13-8a71-39f12b8abfa3' && oppgave.tildeling?.paaVent
                : true,
        )
        .filter((oppgave) =>
            filtrering.ingenUkategoriserteEgenskaper
                ? !oppgave.egenskaper.some((egenskap) => egenskap.kategori === Kategori.Ukategorisert)
                : true,
        )
        .filter(
            (oppgave) =>
                // OBS: Dette er ikke helt sånn filtrering av egenskaper gjøres backend.
                filtrering.egenskaper.length === 0 ||
                filtrering.egenskaper.every((egenskap) =>
                    oppgave.egenskaper.map((oppgaveegenskap) => oppgaveegenskap.egenskap).includes(egenskap.egenskap),
                ),
        )
        .filter(
            (oppgave) =>
                filtrering.tildelt === null ||
                (filtrering.tildelt === true ? oppgave.tildeling !== undefined : oppgave.tildeling === undefined),
        );
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

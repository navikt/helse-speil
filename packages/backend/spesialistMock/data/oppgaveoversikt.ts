import {
    BehandledeOppgaver,
    Egenskap,
    FiltreringInput,
    Kategori,
    OppgaveTilBehandling,
    OppgaverTilBehandling,
    OppgavesorteringInput,
    Sorteringsnokkel,
} from '../schemaTypes';
import { PaVentMock } from '../storage/påvent';
import { TildelingMock } from '../storage/tildeling';
import { behandledeOppgaver } from './behandledeOppgaver';
import { tilfeldigeBehandledeOppgaver, tilfeldigeOppgaver } from './mockDataGenerator';
import { oppgaver } from './oppgaver';

export const behandledeOppgaverliste = (offset: number, limit: number): BehandledeOppgaver => {
    const behandledeOppgaverliste = behandledeOppgaver.concat(tilfeldigeBehandledeOppgaver);

    return {
        oppgaver:
            offset === 0
                ? behandledeOppgaverliste.slice(0, limit)
                : behandledeOppgaverliste.slice(offset).slice(0, limit),
        totaltAntallOppgaver: behandledeOppgaverliste.length,
    } as BehandledeOppgaver;
};

export const oppgaveliste = (
    offset: number,
    limit: number,
    sortering: OppgavesorteringInput[],
    filtrering: FiltreringInput,
): OppgaverTilBehandling => {
    const oppgaveliste = syncTildelingMock(oppgaver).concat(tilfeldigeOppgaver);
    const filtrertListe = filtrer(oppgaveliste, filtrering);
    const sortertListe = sorter(filtrertListe, sortering);

    return {
        oppgaver: offset === 0 ? sortertListe.slice(0, limit) : sortertListe.slice(offset).slice(0, limit),
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
        )
        .filter(
            (oppgave) =>
                filtrering.ekskluderteEgenskaper?.length === 0 ||
                filtrering.ekskluderteEgenskaper?.every(
                    (ekskludertEgenskap) =>
                        !oppgave.egenskaper
                            .map((oppgaveegenskap) => oppgaveegenskap.egenskap)
                            .includes(ekskludertEgenskap.egenskap),
                ),
        );
};

const sorter = (oppgaver: OppgaveTilBehandling[], sortering: OppgavesorteringInput[]): OppgaveTilBehandling[] => {
    const sorteringting = sortering[0];
    switch (sorteringting?.nokkel) {
        case Sorteringsnokkel.Opprettet:
            return sorterOppgaver(oppgaver, sorteringting.stigende, opprettetSortFunction);
        case Sorteringsnokkel.TildeltTil:
            return sorterOppgaver(oppgaver, sorteringting.stigende, saksbehandlerSortFunction);
        case Sorteringsnokkel.SoknadMottatt:
            return sorterOppgaver(oppgaver, sorteringting.stigende, søknadMottattSortFunction);
        default:
            return oppgaver;
    }
};

const sorterOppgaver = (
    oppgaver: OppgaveTilBehandling[],
    stigende: boolean,
    sortFunction: (a: OppgaveTilBehandling, b: OppgaveTilBehandling) => number,
): OppgaveTilBehandling[] => oppgaver.slice().sort((a, b) => (stigende ? sortFunction(a, b) : sortFunction(b, a)));

const saksbehandlerSortFunction = (a: OppgaveTilBehandling, b: OppgaveTilBehandling) => {
    if (!a.tildeling) return 1;
    if (!b.tildeling) return -1;
    if (a.tildeling.navn > b.tildeling.navn) return 1;
    if (a.tildeling.navn < b.tildeling.navn) return -1;
    return 0;
};

const opprettetSortFunction = (a: OppgaveTilBehandling, b: OppgaveTilBehandling) =>
    new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime();

const søknadMottattSortFunction = (a: OppgaveTilBehandling, b: OppgaveTilBehandling) =>
    new Date(a.opprinneligSoknadsdato).getTime() - new Date(b.opprinneligSoknadsdato).getTime();

const syncTildelingMock = (oppgaver: OppgaveTilBehandling[]) => {
    return oppgaver.map((oppgave) => {
        if (oppgave.tildeling !== undefined && oppgave.tildeling !== null && !TildelingMock.harTildeling(oppgave.id)) {
            TildelingMock.setTildeling(oppgave.id, oppgave.tildeling);
        }
        const egenskaper = PaVentMock.erPåVent(oppgave.id)
            ? [...oppgave.egenskaper, { egenskap: Egenskap.PaVent, kategori: Kategori.Status }]
            : oppgave.egenskaper;
        return {
            ...oppgave,
            tildeling: TildelingMock.getTildeling(oppgave.id),
            egenskaper: egenskaper,
        } as OppgaveTilBehandling;
    });
};

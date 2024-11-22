import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';

import {
    BehandledeOppgaver,
    Egenskap,
    FiltreringInput,
    Kategori,
    LagtPaVent,
    Maybe,
    OppgaveTilBehandling,
    Oppgaveegenskap,
    OppgaverTilBehandling,
    OppgavesorteringInput,
    PaVentInfo,
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
    const oppgaveliste = syncMock(oppgaver).concat(tilfeldigeOppgaver);
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
            filtrering.egneSaker ? oppgave.tildeling?.oid === '11111111-2222-3333-4444-555555555555' : true,
        )
        .filter((oppgave) =>
            filtrering.egneSakerPaVent
                ? oppgave.tildeling?.oid === '11111111-2222-3333-4444-555555555555' &&
                  oppgave.egenskaper.find((it: Oppgaveegenskap) => it.egenskap === Egenskap.PaVent) !== undefined
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
                filtrering.egenskaper
                    .filter((f) => f.egenskap !== Egenskap.Infotrygdforlengelse)
                    .every((egenskap) =>
                        oppgave.egenskaper
                            .map((oppgaveegenskap) => oppgaveegenskap.egenskap)
                            .includes(egenskap.egenskap),
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

const syncMock = (oppgaver: OppgaveTilBehandling[]) => {
    return oppgaver.map((oppgave) => {
        if (oppgave.tildeling !== undefined && oppgave.tildeling !== null && !TildelingMock.harTildeling(oppgave.id)) {
            TildelingMock.setTildeling(oppgave.id, oppgave.tildeling);
        }

        let paVentInfo: Maybe<PaVentInfo> = oppgave.paVentInfo ?? null;
        let egenskaper = oppgave.egenskaper;

        if (PaVentMock.finnesIMock(oppgave.id)) {
            if (!PaVentMock.erPåVent(oppgave.id)) {
                paVentInfo = null;
                egenskaper = egenskaper.filter((e) => e.egenskap !== Egenskap.PaVent);
            } else {
                const historikkinnslag = HistorikkinnslagMock.getSisteLagtPåVentHistorikkinnslag(
                    oppgave.vedtaksperiodeId,
                ) as LagtPaVent;

                paVentInfo = {
                    arsaker: historikkinnslag.arsaker,
                    tekst: historikkinnslag.notattekst,
                    dialogRef: historikkinnslag.dialogRef!!,
                    opprettet: historikkinnslag.timestamp,
                    saksbehandler: historikkinnslag.saksbehandlerIdent!!,
                    tidsfrist: historikkinnslag.frist!!,
                    kommentarer: [],
                };
                egenskaper = !egenskaper.some((e) => e.egenskap === Egenskap.PaVent)
                    ? [...egenskaper, { egenskap: Egenskap.PaVent, kategori: Kategori.Status }]
                    : egenskaper;
            }
        } else if (oppgave.paVentInfo !== undefined && oppgave.paVentInfo !== null) {
            PaVentMock.setPåVent(oppgave.id, {
                frist: oppgave.paVentInfo?.tidsfrist,
                oid: '11111111-2222-3333-4444-555555555555',
            });
        }

        return {
            ...oppgave,
            tildeling: TildelingMock.getTildeling(oppgave.id),
            egenskaper: egenskaper,
            paVentInfo: paVentInfo,
        } as OppgaveTilBehandling;
    });
};

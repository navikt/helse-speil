import dayjs from 'dayjs';

import {
    ApiEgenskap,
    OppgaveProjeksjon,
    OppgaveProjeksjonPaaVentInfo,
    OppgaveProjeksjonSide,
    OppgaveSorteringsfelt,
    Sorteringsrekkefølge,
} from '@io/rest/generated/spesialist.schemas';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';

import { BehandledeOppgaver, BehandletOppgave, LagtPaVent } from '../schemaTypes';
import { PaVentMock } from '../storage/påvent';
import { TildelingMock } from '../storage/tildeling';
import { behandledeOppgaver } from './behandledeOppgaver';
import { tilfeldigeBehandledeOppgaver, tilfeldigeOppgaver } from './mockDataGenerator';
import { oppgaveVedtaksperioder, oppgaver } from './oppgaver';

export const behandledeOppgaverliste = (
    offset: number,
    limit: number,
    fom: string,
    tom: string,
): BehandledeOppgaver => {
    const behandledeOppgaverliste = behandledeOppgaver.concat(tilfeldigeBehandledeOppgaver);
    const filtrertList = filtrerBehandlede(behandledeOppgaverliste, fom, tom);

    const oppgaverEtterOffset =
        offset === 0 ? filtrertList.slice(0, limit) : filtrertList.slice(offset).slice(0, limit);

    return {
        oppgaver: oppgaverEtterOffset,
        // Dette er sånn spesialist fungerer pt dessverre. Skulle egentlig hatt antallet filtrerte oppgaver
        // før offset er applied, selvom det er 0 oppgaver på den siste siden
        totaltAntallOppgaver: oppgaverEtterOffset.length > 0 ? filtrertList.length : 0,
    } as BehandledeOppgaver;
};

const toNumberOrNull = (v: string | null): number | null => {
    if (v == null || v.trim() === '') return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
};

const tilBooleanEllerNull = (searchParam: string | null) => {
    switch (searchParam) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return null;
    }
};

function stringTilListeAvEgenskaper(ingenAvEgenskapeneString: string) {
    return ingenAvEgenskapeneString.split(',').map((egenskap) => egenskap as ApiEgenskap);
}

export const oppgaveliste = (searchParams: URLSearchParams): OppgaveProjeksjonSide => {
    const sidetall = toNumberOrNull(searchParams.get('sidetall')) ?? 1;
    const sidestoerrelse = toNumberOrNull(searchParams.get('sidestoerrelse')) ?? 10;

    const minstEnAvEgenskapene: ApiEgenskap[][] = [];
    searchParams.getAll('minstEnAvEgenskapene').forEach((value) => {
        minstEnAvEgenskapene.push(stringTilListeAvEgenskaper(value));
    });

    const ingenAvEgenskapeneString = searchParams.get('ingenAvEgenskapene');
    const ingenAvEgenskapene = ingenAvEgenskapeneString ? stringTilListeAvEgenskaper(ingenAvEgenskapeneString) : [];

    const erTildelt = tilBooleanEllerNull(searchParams.get('erTildelt'));
    const tildeltTilOid = searchParams.get('tildeltTilOid');
    const erPaaVent = tilBooleanEllerNull(searchParams.get('erPaaVent'));

    const sortertingsfelt = searchParams.get('sorteringsfelt') as OppgaveSorteringsfelt;
    const sorteringsrekkefølge = searchParams.get('sorteringsrekkefoelge') as Sorteringsrekkefølge;

    const oppgaveliste = syncMock(oppgaver).concat(tilfeldigeOppgaver);
    const filtrertListe = filtrer(
        oppgaveliste,
        minstEnAvEgenskapene,
        ingenAvEgenskapene,
        erTildelt,
        tildeltTilOid,
        erPaaVent,
    );
    const sortertListe = sorter(filtrertListe, sortertingsfelt, sorteringsrekkefølge);

    const oppgaverEtterOffset =
        sidetall === 1
            ? sortertListe.slice(0, sidestoerrelse)
            : sortertListe.slice((sidetall - 1) * sidestoerrelse).slice(0, sidestoerrelse);

    return {
        elementer: oppgaverEtterOffset,
        sidestoerrelse: sidestoerrelse,
        sidetall: sidetall,
        totaltAntall: sortertListe.length,
        totaltAntallSider: Math.floor((sortertListe.length + (sidestoerrelse - 1)) / sidestoerrelse),
        oppgaver: oppgaverEtterOffset,
    } as OppgaveProjeksjonSide;
};

const sorter = (
    oppgaver: OppgaveProjeksjon[],
    sortering: OppgaveSorteringsfelt,
    sorteringsrekkefølge: Sorteringsrekkefølge,
): OppgaveProjeksjon[] => {
    switch (sortering) {
        case OppgaveSorteringsfelt.opprettetTidspunkt:
            return sorterOppgaver(oppgaver, sorteringsrekkefølge, opprettetSortFunction);
        case OppgaveSorteringsfelt.tildeling:
            return sorterOppgaver(oppgaver, sorteringsrekkefølge, saksbehandlerSortFunction);
        case OppgaveSorteringsfelt.opprinneligSoeknadstidspunkt:
            return sorterOppgaver(oppgaver, sorteringsrekkefølge, søknadMottattSortFunction);
        case OppgaveSorteringsfelt.paVentInfo_tidsfrist:
            return sorterOppgaver(oppgaver, sorteringsrekkefølge, oppfølgingsdatoSortFunction);
        default:
            return oppgaver;
    }
};

const sorterOppgaver = (
    oppgaver: OppgaveProjeksjon[],
    sorteringsrekkefølge: Sorteringsrekkefølge,
    sortFunction: (sorteringsrekkefølge: Sorteringsrekkefølge, a: OppgaveProjeksjon, b: OppgaveProjeksjon) => number,
): OppgaveProjeksjon[] => oppgaver.slice().sort((a, b) => sortFunction(sorteringsrekkefølge, a, b));

const filtrerBehandlede = (oppgaver: BehandletOppgave[], fom: string, tom: string): BehandletOppgave[] => {
    return oppgaver.filter((oppgave) => {
        const ferdigstiltDato = dayjs(oppgave.ferdigstiltTidspunkt);
        return ferdigstiltDato.isSameOrAfter(dayjs(fom), 'day') && ferdigstiltDato.isSameOrBefore(dayjs(tom), 'day');
    });
};

const saksbehandlerSortFunction = (rekkefølge: Sorteringsrekkefølge, a: OppgaveProjeksjon, b: OppgaveProjeksjon) => {
    if (!a.tildeling && !b.tildeling) {
        return 0;
    } else if (!a.tildeling && !!b.tildeling) {
        return 1;
    } else if (!b.tildeling && !!a.tildeling) {
        return -1;
    } else {
        if (rekkefølge === Sorteringsrekkefølge.STIGENDE) {
            if (a.tildeling!.navn > b.tildeling!.navn) return 1;
            if (a.tildeling!.navn < b.tildeling!.navn) return -1;
        } else {
            if (a.tildeling!.navn < b.tildeling!.navn) return 1;
            if (a.tildeling!.navn > b.tildeling!.navn) return -1;
        }
    }
    return 0;
};

const tidspunktSortFunction = (rekkefølge: Sorteringsrekkefølge, a: string, b: string) => {
    if (rekkefølge === Sorteringsrekkefølge.STIGENDE) {
        return new Date(a).getTime() - new Date(b).getTime();
    } else {
        return new Date(b).getTime() - new Date(a).getTime();
    }
};

const opprettetSortFunction = (rekkefølge: Sorteringsrekkefølge, a: OppgaveProjeksjon, b: OppgaveProjeksjon) =>
    tidspunktSortFunction(rekkefølge, a.opprettetTidspunkt, b.opprettetTidspunkt);

const søknadMottattSortFunction = (rekkefølge: Sorteringsrekkefølge, a: OppgaveProjeksjon, b: OppgaveProjeksjon) =>
    tidspunktSortFunction(rekkefølge, a.opprinneligSoeknadstidspunkt, b.opprinneligSoeknadstidspunkt);

const oppfølgingsdatoSortFunction = (rekkefølge: Sorteringsrekkefølge, a: OppgaveProjeksjon, b: OppgaveProjeksjon) => {
    if (!a.paVentInfo && !b.paVentInfo) {
        return 0;
    } else if (!a.paVentInfo && !!b.paVentInfo) {
        return 1;
    } else if (!b.paVentInfo && !!a.paVentInfo) {
        return -1;
    } else {
        return tidspunktSortFunction(rekkefølge, a.paVentInfo!.tidsfrist, b.paVentInfo!.tidsfrist);
    }
};

const filtrer = (
    oppgaver: OppgaveProjeksjon[],
    minstEnAvEgenskapene: ApiEgenskap[][],
    ingenAvEgenskapene: ApiEgenskap[],
    erTildelt: boolean | null,
    tildeltTilOid: string | null,
    erPaaVent: boolean | null,
): OppgaveProjeksjon[] => {
    return oppgaver
        .filter((oppgave) => tildeltTilOid === null || oppgave.tildeling?.oid === tildeltTilOid)
        .filter((oppgave) => erPaaVent === null || oppgave.egenskaper.includes(ApiEgenskap.PA_VENT) === erPaaVent)
        .filter(
            (oppgave) =>
                ingenAvEgenskapene.length === 0 ||
                ingenAvEgenskapene.every((ekskludertEgenskap) => !oppgave.egenskaper.includes(ekskludertEgenskap)),
        )
        .filter((oppgave) => erTildelt === null || (oppgave.tildeling !== undefined) === erTildelt)
        .filter(
            (oppgave) =>
                minstEnAvEgenskapene.length === 0 ||
                minstEnAvEgenskapene.every((egenskapGruppe) =>
                    egenskapGruppe.some((egenskap) => oppgave.egenskaper.includes(egenskap)),
                ),
        );
};

const syncMock = (oppgaver: OppgaveProjeksjon[]) => {
    return oppgaver.map((oppgave) => {
        if (oppgave.tildeling !== undefined && oppgave.tildeling !== null && !TildelingMock.harTildeling(oppgave.id)) {
            TildelingMock.setTildeling(oppgave.id, oppgave.tildeling);
        }

        let paVentInfo: OppgaveProjeksjonPaaVentInfo | null = oppgave.paVentInfo ?? null;
        let egenskaper = oppgave.egenskaper;

        if (PaVentMock.finnesIMock(oppgave.id)) {
            if (!PaVentMock.erPåVent(oppgave.id)) {
                paVentInfo = null;
                egenskaper = egenskaper.filter((e) => e !== ApiEgenskap.PA_VENT);
            } else {
                const historikkinnslag = HistorikkinnslagMock.getSisteLagtPåVentHistorikkinnslag(
                    oppgaveVedtaksperioder.find((it) => it.id === oppgave.id)!.vedtaksperiodeId,
                ) as LagtPaVent;

                if (!!historikkinnslag) {
                    paVentInfo = {
                        arsaker: historikkinnslag.arsaker,
                        tekst: historikkinnslag.notattekst,
                        dialogRef: historikkinnslag.dialogRef!,
                        opprettet: historikkinnslag.timestamp,
                        saksbehandler: historikkinnslag.saksbehandlerIdent!,
                        tidsfrist: historikkinnslag.frist!,
                        kommentarer: historikkinnslag.kommentarer.map((kommentar) => ({
                            __typename: 'OppgaveProjeksjonPaaVentKommentar',
                            feilregistrert_tidspunkt: kommentar.feilregistrert_tidspunkt,
                            id: kommentar.id,
                            opprettet: kommentar.opprettet,
                            saksbehandlerident: kommentar.saksbehandlerident,
                            tekst: kommentar.tekst,
                        })),
                    };
                    egenskaper = !egenskaper.some((e) => e === ApiEgenskap.PA_VENT)
                        ? [...egenskaper, ApiEgenskap.PA_VENT]
                        : egenskaper;
                }
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
        } as OppgaveProjeksjon;
    });
};

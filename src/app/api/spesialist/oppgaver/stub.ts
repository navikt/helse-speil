import { NextRequest } from 'next/server';

import { logger } from '@navikt/next-logger';

import {
    ApiEgenskap,
    ApiOppgaveProjeksjon,
    ApiOppgaveProjeksjonPaaVentInfo,
    ApiOppgaveProjeksjonSide,
    ApiOppgaveSorteringsfelt,
    ApiSorteringsrekkefølge,
} from '@io/rest/generated/spesialist.schemas';
import { tilfeldigeOppgaver } from '@spesialist-mock/data/mockDataGenerator';
import { oppgaveVedtaksperioder, oppgaver } from '@spesialist-mock/data/oppgaver';
import { LagtPaVent } from '@spesialist-mock/schemaTypes';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { PersonMock } from '@spesialist-mock/storage/person';
import { PaVentMock } from '@spesialist-mock/storage/påvent';
import { TildelingMock } from '@spesialist-mock/storage/tildeling';

export const stub = async (request: NextRequest) => Response.json(oppgaveliste(request.nextUrl.searchParams));

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

const sorter = (
    oppgaver: ApiOppgaveProjeksjon[],
    sortering: ApiOppgaveSorteringsfelt,
    sorteringsrekkefølge: ApiSorteringsrekkefølge,
): ApiOppgaveProjeksjon[] => {
    switch (sortering) {
        case ApiOppgaveSorteringsfelt.opprettetTidspunkt:
            return sorterOppgaver(oppgaver, sorteringsrekkefølge, opprettetSortFunction);
        case ApiOppgaveSorteringsfelt.tildeling:
            return sorterOppgaver(oppgaver, sorteringsrekkefølge, saksbehandlerSortFunction);
        case ApiOppgaveSorteringsfelt.opprinneligSoeknadstidspunkt:
            return sorterOppgaver(oppgaver, sorteringsrekkefølge, søknadMottattSortFunction);
        case ApiOppgaveSorteringsfelt.behandlingOpprettetTidspunkt:
            return sorterOppgaver(oppgaver, sorteringsrekkefølge, behandlingOpprettetSortFunction);
        case ApiOppgaveSorteringsfelt.paVentInfo_tidsfrist:
            return sorterOppgaver(oppgaver, sorteringsrekkefølge, oppfølgingsdatoSortFunction);
        default:
            return oppgaver;
    }
};

const oppgaveliste = (searchParams: URLSearchParams): ApiOppgaveProjeksjonSide => {
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

    const sortertingsfelt = searchParams.get('sorteringsfelt') as ApiOppgaveSorteringsfelt;
    const sorteringsrekkefølge = searchParams.get('sorteringsrekkefoelge') as ApiSorteringsrekkefølge;

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
    } as ApiOppgaveProjeksjonSide;
};

const sorterOppgaver = (
    oppgaver: ApiOppgaveProjeksjon[],
    sorteringsrekkefølge: ApiSorteringsrekkefølge,
    sortFunction: (
        sorteringsrekkefølge: ApiSorteringsrekkefølge,
        a: ApiOppgaveProjeksjon,
        b: ApiOppgaveProjeksjon,
    ) => number,
): ApiOppgaveProjeksjon[] => oppgaver.slice().sort((a, b) => sortFunction(sorteringsrekkefølge, a, b));

const saksbehandlerSortFunction = (
    rekkefølge: ApiSorteringsrekkefølge,
    a: ApiOppgaveProjeksjon,
    b: ApiOppgaveProjeksjon,
) => {
    if (!a.tildeling && !b.tildeling) {
        return 0;
    } else if (!a.tildeling && !!b.tildeling) {
        return 1;
    } else if (!b.tildeling && !!a.tildeling) {
        return -1;
    } else {
        if (rekkefølge === ApiSorteringsrekkefølge.STIGENDE) {
            if (a.tildeling!.navn > b.tildeling!.navn) return 1;
            if (a.tildeling!.navn < b.tildeling!.navn) return -1;
        } else {
            if (a.tildeling!.navn < b.tildeling!.navn) return 1;
            if (a.tildeling!.navn > b.tildeling!.navn) return -1;
        }
    }
    return 0;
};

const tidspunktSortFunction = (rekkefølge: ApiSorteringsrekkefølge, a: string, b: string) => {
    if (rekkefølge === ApiSorteringsrekkefølge.STIGENDE) {
        return new Date(a).getTime() - new Date(b).getTime();
    } else {
        return new Date(b).getTime() - new Date(a).getTime();
    }
};

const opprettetSortFunction = (rekkefølge: ApiSorteringsrekkefølge, a: ApiOppgaveProjeksjon, b: ApiOppgaveProjeksjon) =>
    tidspunktSortFunction(rekkefølge, a.opprettetTidspunkt, b.opprettetTidspunkt);

const søknadMottattSortFunction = (
    rekkefølge: ApiSorteringsrekkefølge,
    a: ApiOppgaveProjeksjon,
    b: ApiOppgaveProjeksjon,
) => tidspunktSortFunction(rekkefølge, a.opprinneligSoeknadstidspunkt, b.opprinneligSoeknadstidspunkt);

const behandlingOpprettetSortFunction = (
    rekkefølge: ApiSorteringsrekkefølge,
    a: ApiOppgaveProjeksjon,
    b: ApiOppgaveProjeksjon,
) => tidspunktSortFunction(rekkefølge, a.behandlingOpprettetTidspunkt, b.behandlingOpprettetTidspunkt);

const oppfølgingsdatoSortFunction = (
    rekkefølge: ApiSorteringsrekkefølge,
    a: ApiOppgaveProjeksjon,
    b: ApiOppgaveProjeksjon,
) => {
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
    oppgaver: ApiOppgaveProjeksjon[],
    minstEnAvEgenskapene: ApiEgenskap[][],
    ingenAvEgenskapene: ApiEgenskap[],
    erTildelt: boolean | null,
    tildeltTilOid: string | null,
    erPaaVent: boolean | null,
): ApiOppgaveProjeksjon[] => {
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

const syncMock = (oppgaver: ApiOppgaveProjeksjon[]) => {
    return oppgaver.map((oppgave) => {
        const personPseudoId = PersonMock.findPersonPseudoId(oppgave.aktorId);
        if (personPseudoId != null) oppgave.personPseudoId = personPseudoId;
        else logger.error(`Fant ikke personPseudoId for oppgave med aktørId ${oppgave.aktorId}`);
        if (oppgave.tildeling !== undefined && oppgave.tildeling !== null && !TildelingMock.harTildeling(oppgave.id)) {
            TildelingMock.setTildeling(oppgave.id, oppgave.tildeling);
        }

        let paVentInfo: ApiOppgaveProjeksjonPaaVentInfo | null = oppgave.paVentInfo ?? null;
        let egenskaper = oppgave.egenskaper;

        if (PaVentMock.finnesIMock(oppgave.id)) {
            if (!PaVentMock.erPåVent(oppgave.id)) {
                paVentInfo = null;
                egenskaper = egenskaper.filter((e) => e !== ApiEgenskap.PA_VENT);
            } else {
                const historikkinnslag = HistorikkinnslagMock.getSisteLagtPåVentHistorikkinnslag(
                    oppgaveVedtaksperioder.find((it) => it.id === oppgave.id)!.vedtaksperiodeId,
                ) as LagtPaVent;

                if (historikkinnslag) {
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
        } as ApiOppgaveProjeksjon;
    });
};

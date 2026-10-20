import { NextRequest } from 'next/server';

import {
    ApiEgenskap,
    ApiOppgaveProjeksjon,
    ApiOppgaveProjeksjonSide,
    ApiOppgaveSorteringsfelt,
    ApiSorteringsrekkefølge,
} from '@io/rest/generated/spesialist.schemas';
import { filtrerOppgaver, hentSynkedeOppgaver } from '@spesialist-mock/oppgaveliste';

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
        case ApiOppgaveSorteringsfelt.behandlingOpprettetTidspunkt:
            return sorterOppgaver(oppgaver, sorteringsrekkefølge, behandlingOpprettetSortFunction);
        case ApiOppgaveSorteringsfelt.påVentInfo_tidsfrist:
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
    const oppgaveKlarFom = searchParams.get('oppgaveKlarFom');
    const oppgaveKlarTom = searchParams.get('oppgaveKlarTom');
    const behandlingOpprettetFom = searchParams.get('behandlingOpprettetFom');
    const behandlingOpprettetTom = searchParams.get('behandlingOpprettetTom');

    const sortertingsfelt = searchParams.get('sorteringsfelt') as ApiOppgaveSorteringsfelt;
    const sorteringsrekkefølge = searchParams.get('sorteringsrekkefoelge') as ApiSorteringsrekkefølge;

    const oppgaveliste = hentSynkedeOppgaver();
    const filtrertListe = filtrerOppgaver(
        oppgaveliste,
        minstEnAvEgenskapene,
        ingenAvEgenskapene,
        erTildelt,
        tildeltTilOid,
        erPaaVent,
        oppgaveKlarFom,
        oppgaveKlarTom,
        behandlingOpprettetFom,
        behandlingOpprettetTom,
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
    if (!a.påVentInfo && !b.påVentInfo) {
        return 0;
    } else if (!a.påVentInfo && !!b.påVentInfo) {
        return 1;
    } else if (!b.påVentInfo && !!a.påVentInfo) {
        return -1;
    } else {
        return tidspunktSortFunction(rekkefølge, a.påVentInfo!.tidsfrist, b.påVentInfo!.tidsfrist);
    }
};

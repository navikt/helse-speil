import { logger } from '@navikt/next-logger';

import {
    ApiEgenskap,
    ApiOppgaveProjeksjon,
    ApiOppgaveProjeksjonPåVentInfo,
} from '@io/rest/generated/spesialist.schemas';
import { lokalSaksbehandlerOid } from '@spesialist-mock/constants';
import { tilfeldigeOppgaver } from '@spesialist-mock/data/mockDataGenerator';
import { oppgaveVedtaksperioder, oppgaver } from '@spesialist-mock/data/oppgaver';
import { LagtPaVent } from '@spesialist-mock/schemaTypes';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { PersonMock } from '@spesialist-mock/storage/person';
import { PaVentMock } from '@spesialist-mock/storage/påvent';
import { TildelingMock } from '@spesialist-mock/storage/tildeling';

// Felles kilde for oppgavelista og antall-oppgaver, så tellerne alltid stemmer med listene i fanene
export function hentSynkedeOppgaver(): ApiOppgaveProjeksjon[] {
    return syncMock(oppgaver).concat(tilfeldigeOppgaver);
}

export function filtrerOppgaver(
    oppgaver: ApiOppgaveProjeksjon[],
    minstEnAvEgenskapene: ApiEgenskap[][],
    ingenAvEgenskapene: ApiEgenskap[],
    erTildelt: boolean | null,
    tildeltTilOid: string | null,
    erPaaVent: boolean | null,
    oppgaveKlarFom: string | null,
    oppgaveKlarTom: string | null,
    behandlingOpprettetFom: string | null,
    behandlingOpprettetTom: string | null,
): ApiOppgaveProjeksjon[] {
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
        )
        .filter((oppgave) => {
            if (!oppgaveKlarFom && !oppgaveKlarTom) return true;
            const opprettet = oppgave.opprettetTidspunkt.slice(0, 10);
            if (oppgaveKlarFom && opprettet < oppgaveKlarFom) return false;
            return !(oppgaveKlarTom && opprettet > oppgaveKlarTom);
        })
        .filter((oppgave) => {
            if (!behandlingOpprettetFom && !behandlingOpprettetTom) return true;
            const behandlingOpprettet = oppgave.behandlingOpprettetTidspunkt.slice(0, 10);
            if (behandlingOpprettetFom && behandlingOpprettet < behandlingOpprettetFom) return false;
            return !(behandlingOpprettetTom && behandlingOpprettet > behandlingOpprettetTom);
        });
}

function syncMock(oppgaver: ApiOppgaveProjeksjon[]) {
    return oppgaver.map((oppgave) => {
        const personPseudoId = PersonMock.findPersonPseudoId(oppgave.aktorId);
        if (personPseudoId != null) oppgave.personPseudoId = personPseudoId;
        else logger.error(`Fant ikke personPseudoId for oppgave med aktørId ${oppgave.aktorId}`);
        if (
            oppgave.tildeling !== undefined &&
            oppgave.tildeling !== null &&
            !TildelingMock.harTildeling(oppgave.personPseudoId)
        ) {
            TildelingMock.setTildeling(oppgave.personPseudoId, oppgave.tildeling);
        }

        let påVentInfo: ApiOppgaveProjeksjonPåVentInfo | null = oppgave.påVentInfo ?? null;
        let egenskaper = oppgave.egenskaper;

        if (PaVentMock.finnesIMock(oppgave.id)) {
            if (!PaVentMock.erPåVent(oppgave.id)) {
                påVentInfo = null;
                egenskaper = egenskaper.filter((e) => e !== ApiEgenskap.PA_VENT);
            } else {
                const historikkinnslag = HistorikkinnslagMock.getSisteLagtPåVentHistorikkinnslag(
                    oppgaveVedtaksperioder.find((it) => it.id === oppgave.id)!.vedtaksperiodeId,
                ) as LagtPaVent;

                if (historikkinnslag) {
                    påVentInfo = {
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
        } else if (oppgave.påVentInfo !== undefined && oppgave.påVentInfo !== null) {
            PaVentMock.setPåVent(oppgave.id, {
                frist: oppgave.påVentInfo?.tidsfrist,
                oid: lokalSaksbehandlerOid,
            });
        }

        return {
            ...oppgave,
            tildeling: TildelingMock.getTildeling(oppgave.personPseudoId),
            egenskaper: egenskaper,
            påVentInfo: påVentInfo,
        } as ApiOppgaveProjeksjon;
    });
}

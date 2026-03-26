import { NextRequest } from 'next/server';

import { logger } from '@navikt/next-logger';

import {
    ApiEgenskap,
    ApiOppgaveProjeksjon,
    ApiOppgaveProjeksjonPaaVentInfo,
    ApiOppgaveProjeksjonSide,
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

const oppgaveliste = (searchParams: URLSearchParams): ApiOppgaveProjeksjonSide => {
    const sidetall = toNumberOrNull(searchParams.get('sidetall')) ?? 1;
    const sidestoerrelse = toNumberOrNull(searchParams.get('sidestoerrelse')) ?? 10;

    const oppgaveliste = syncMock(oppgaver).concat(tilfeldigeOppgaver);

    const oppgaverEtterOffset =
        sidetall === 1
            ? oppgaveliste.slice(0, sidestoerrelse)
            : oppgaveliste.slice((sidetall - 1) * sidestoerrelse).slice(0, sidestoerrelse);

    return {
        elementer: oppgaverEtterOffset,
        sidestoerrelse: sidestoerrelse,
        sidetall: sidetall,
        totaltAntall: oppgaveliste.length,
        totaltAntallSider: Math.floor((oppgaveliste.length + (sidestoerrelse - 1)) / sidestoerrelse),
        oppgaver: oppgaverEtterOffset,
    } as ApiOppgaveProjeksjonSide;
};

const syncMock = (oppgaver: ApiOppgaveProjeksjon[]) => {
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
            tildeling: TildelingMock.getTildeling(oppgave.personPseudoId),
            egenskaper: egenskaper,
            paVentInfo: paVentInfo,
        } as ApiOppgaveProjeksjon;
    });
};

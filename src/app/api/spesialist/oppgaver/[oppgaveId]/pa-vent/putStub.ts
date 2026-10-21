import { NextRequest, NextResponse } from 'next/server';

import {
    ApiPeriodehistorikkType,
    ApiPutPåVentErrorCode,
    ApiPutPåVentRequest,
} from '@io/rest/generated/spesialist.schemas';
import { lokalSaksbehandlerOid, lokalTildeling } from '@spesialist-mock/constants';
import { finnOppgavereferanse } from '@spesialist-mock/periodeoppslag';
import { problemDetails } from '@spesialist-mock/problemDetails';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { PaVentMock } from '@spesialist-mock/storage/påvent';
import { TildelingMock } from '@spesialist-mock/storage/tildeling';

export const putStub = async (request: NextRequest, params: Promise<{ oppgaveId: string }>) => {
    const { oppgaveId } = await params;
    const { frist, skalTildeles, notattekst, årsaker }: ApiPutPåVentRequest = await request.json();

    const oppgavereferanse = finnOppgavereferanse(oppgaveId);
    if (!oppgavereferanse) {
        return problemDetails(404, ApiPutPåVentErrorCode.OPPGAVE_IKKE_FUNNET, 'Oppgave ikke funnet');
    }
    const { personPseudoId, vedtaksperiodeId } = oppgavereferanse;

    PaVentMock.setPåVent(oppgaveId, { frist: frist, oid: lokalSaksbehandlerOid });
    if (skalTildeles) {
        TildelingMock.setTildeling(personPseudoId, lokalTildeling);
    } else {
        TildelingMock.fjernTildeling(personPseudoId);
    }
    HistorikkinnslagMock.addHistorikkinnslag(vedtaksperiodeId, {
        notattekst: notattekst,
        frist: frist,
        arsaker: årsaker ? årsaker.map((årsak) => årsak.årsak) : [],
        historikktype: ApiPeriodehistorikkType.LEGG_PA_VENT,
        dialogRef: DialogMock.addDialog(),
    });

    return new NextResponse(null, { status: 204 });
};

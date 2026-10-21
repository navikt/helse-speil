import { NextRequest, NextResponse } from 'next/server';

import { ApiDeletePåVentErrorCode, ApiPeriodehistorikkType } from '@io/rest/generated/spesialist.schemas';
import { finnOppgavereferanse } from '@spesialist-mock/periodeoppslag';
import { problemDetails } from '@spesialist-mock/problemDetails';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { PaVentMock } from '@spesialist-mock/storage/påvent';

export const deleteStub = async (_: NextRequest, params: Promise<{ oppgaveId: string }>) => {
    const { oppgaveId } = await params;

    const oppgavereferanse = finnOppgavereferanse(oppgaveId);
    if (!oppgavereferanse) {
        return problemDetails(404, ApiDeletePåVentErrorCode.OPPGAVE_IKKE_FUNNET, 'Oppgave ikke funnet');
    }

    PaVentMock.fjernPåVent(oppgaveId);
    HistorikkinnslagMock.addHistorikkinnslag(oppgavereferanse.vedtaksperiodeId, {
        historikktype: ApiPeriodehistorikkType.FJERN_FRA_PA_VENT,
    });
    return new NextResponse(null, { status: 204 });
};

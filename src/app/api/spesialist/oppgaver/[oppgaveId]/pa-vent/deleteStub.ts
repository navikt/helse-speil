import { NextRequest, NextResponse } from 'next/server';

import { ApiDeletePåVentErrorCode } from '@io/rest/generated/spesialist.schemas';
import { finnOppgavereferanse } from '@spesialist-mock/periodeoppslag';
import { problemDetails } from '@spesialist-mock/problemDetails';
import { PeriodehistorikkType } from '@spesialist-mock/schemaTypes';
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
        type: PeriodehistorikkType.FjernFraPaVent,
    });
    return new NextResponse(null, { status: 204 });
};

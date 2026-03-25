import { NextRequest, NextResponse } from 'next/server';

import { PeriodehistorikkType } from '@spesialist-mock/schemaTypes';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { PaVentMock } from '@spesialist-mock/storage/påvent';

export const deleteStub = async (_: NextRequest, params: Promise<{ oppgaveId: string }>) => {
    const { oppgaveId } = await params;
    PaVentMock.fjernPåVent(oppgaveId);
    HistorikkinnslagMock.addHistorikkinnslag(oppgaveId, {
        type: PeriodehistorikkType.FjernFraPaVent,
    });
    return new NextResponse(null, { status: 204 });
};

import { NextRequest, NextResponse } from 'next/server';

import { PutPåVentMutationBody } from '@io/rest/generated/oppgaver/oppgaver';
import { PeriodehistorikkType } from '@spesialist-mock/schemaTypes';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { PaVentMock } from '@spesialist-mock/storage/påvent';
import { TildelingMock } from '@spesialist-mock/storage/tildeling';

export const putStub = async (request: NextRequest, params: Promise<{ oppgaveId: string }>) => {
    const { oppgaveId } = await params;
    const { frist, skalTildeles, notattekst, årsaker }: PutPåVentMutationBody = await request.json();
    PaVentMock.setPåVent(oppgaveId, { frist: frist, oid: '11111111-2222-3333-4444-555555555555' });
    if (skalTildeles) {
        TildelingMock.setTildeling(oppgaveId, {
            epost: 'epost@nav.no',
            navn: 'Utvikler, Lokal',
            oid: '11111111-2222-3333-4444-555555555555',
        });
    }
    HistorikkinnslagMock.addHistorikkinnslag(oppgaveId, {
        notattekst: notattekst,
        frist: frist,
        arsaker: årsaker ? årsaker.map((årsak) => årsak.årsak) : [],
        type: PeriodehistorikkType.LeggPaVent,
        dialogRef: DialogMock.addDialog(),
    });

    return new NextResponse(null, { status: 204 });
};

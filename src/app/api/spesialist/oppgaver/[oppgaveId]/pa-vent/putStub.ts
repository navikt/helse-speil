import { NextRequest, NextResponse } from 'next/server';

import { PutPåVentMutationBody } from '@io/rest/generated/oppgaver/oppgaver';
import { oppgaver } from '@spesialist-mock/data/oppgaver';
import { PeriodehistorikkType } from '@spesialist-mock/schemaTypes';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { PersonMock } from '@spesialist-mock/storage/person';
import { PaVentMock } from '@spesialist-mock/storage/påvent';
import { TildelingMock } from '@spesialist-mock/storage/tildeling';

export const putStub = async (request: NextRequest, params: Promise<{ oppgaveId: string }>) => {
    const { oppgaveId } = await params;
    const { frist, skalTildeles, notattekst, årsaker }: PutPåVentMutationBody = await request.json();
    PaVentMock.setPåVent(oppgaveId, { frist: frist, oid: '11111111-2222-3333-4444-555555555555' });
    const oppgave = oppgaver.find((it) => it.id === oppgaveId);
    if (!oppgave) {
        return new NextResponse(null, { status: 500 });
    }
    const personPseudoId = PersonMock.findPersonPseudoId(oppgave.aktorId);
    if (!personPseudoId) {
        return new NextResponse(null, { status: 500 });
    }
    if (skalTildeles) {
        TildelingMock.setTildeling(personPseudoId, {
            epost: 'epost@nav.no',
            navn: 'Utvikler, Lokal',
            oid: '11111111-2222-3333-4444-555555555555',
        });
    } else {
        TildelingMock.fjernTildeling(personPseudoId);
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

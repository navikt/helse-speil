import { NextRequest, NextResponse } from 'next/server';

import { PostSendIReturMutationBody } from '@io/rest/generated/oppgaver/oppgaver';
import { PeriodehistorikkType } from '@spesialist-mock/schemaTypes';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { OppgaveMock, getDefaultOppgave } from '@spesialist-mock/storage/oppgave';
import { Oppgave } from '@typer/spesialist-mock';

export const postStub = async (request: NextRequest, params: Promise<{ oppgaveId: string }>) => {
    const { oppgaveId } = await params;
    const { notatTekst }: PostSendIReturMutationBody = await request.json();

    const tidligereSaksbehandler = OppgaveMock.getOppgave(oppgaveId)?.totrinnsvurdering?.saksbehandler;
    const oppgave: Oppgave = {
        ...getDefaultOppgave(),
        id: oppgaveId,
        tildelt: tidligereSaksbehandler,
        totrinnsvurdering: {
            saksbehandler: '11111111-2222-3333-4444-555555555555',
            erRetur: true,
            erBeslutteroppgave: false,
        },
    };

    OppgaveMock.addOrUpdateOppgave(oppgaveId, oppgave);

    HistorikkinnslagMock.addHistorikkinnslag(oppgaveId, {
        type: PeriodehistorikkType.TotrinnsvurderingRetur,
        notattekst: notatTekst,
        dialogRef: DialogMock.addDialog(),
    });

    return new NextResponse(null, { status: 204 });
};

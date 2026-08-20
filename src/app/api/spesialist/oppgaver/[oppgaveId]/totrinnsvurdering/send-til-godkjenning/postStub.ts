import { NextRequest, NextResponse } from 'next/server';

import { OppgaveMock, getDefaultOppgave } from '@spesialist-mock/storage/oppgave';
import { Oppgave } from '@typer/spesialist-mock';

export const postStub = async (request: NextRequest, params: Promise<{ oppgaveId: string }>) => {
    const { oppgaveId } = await params;
    // begrunnelsen sendes med i requesten, men trenger ikke mockes videre her siden lesesiden ikke er migrert
    await request.json();

    const tidligereSaksbehandler = OppgaveMock.getOppgave(oppgaveId)?.totrinnsvurdering?.saksbehandler;
    const oppgave: Oppgave = {
        ...getDefaultOppgave(),
        id: oppgaveId,
        tildelt:
            tidligereSaksbehandler === '11111111-2222-3333-4444-555555555555'
                ? null
                : '11111111-2222-3333-4444-555555555555',
        totrinnsvurdering: {
            erRetur: false,
            erBeslutteroppgave: true,
            saksbehandler: '11111111-2222-3333-4444-555555555555',
        },
    };

    OppgaveMock.addOrUpdateOppgave(oppgaveId, oppgave);

    return new NextResponse(null, { status: 204 });
};

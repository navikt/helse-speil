import { finnOppgaveId } from '@spesialist-mock/graphql';
import { PeriodehistorikkType } from '@spesialist-mock/schemaTypes';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { SaksbehandlerStansMock } from '@spesialist-mock/storage/saksbehandlerstans';

export async function patchStub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const { begrunnelse, stans } = await _request.json();

    const oppgaveId = finnOppgaveId();

    if (stans) {
        SaksbehandlerStansMock.opprettStans(pseudoId, begrunnelse, 'A123456');
    } else {
        SaksbehandlerStansMock.opphevStans(pseudoId);
    }

    if (oppgaveId) {
        HistorikkinnslagMock.addHistorikkinnslag(oppgaveId, {
            type: stans
                ? PeriodehistorikkType.StansAutomatiskBehandlingSaksbehandler
                : PeriodehistorikkType.OpphevStansAutomatiskBehandlingSaksbehandler,
            notattekst: begrunnelse,
            dialogRef: DialogMock.addDialog(),
        });
    }

    return Response.json({ status: 200 });
}

export async function getStub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;

    return Response.json(SaksbehandlerStansMock.getStans(pseudoId));
}

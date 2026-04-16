import { finnOppgaveId } from '@spesialist-mock/graphql';
import { PeriodehistorikkType } from '@spesialist-mock/schemaTypes';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { StansAutomatiskBehandlingMock } from '@spesialist-mock/storage/stansautomatiskbehandling';

export const stub = async (_request: Request, params: Promise<{ pseudoId: string }>) => {
    const { pseudoId } = await params;
    const { begrunnelse, stans } = await _request.json();

    const oppgaveId = finnOppgaveId();

    StansAutomatiskBehandlingMock.stansAutomatiskBehandling(pseudoId, stans);
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
};

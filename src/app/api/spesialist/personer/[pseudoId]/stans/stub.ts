import { finnOppgaveId } from '@spesialist-mock/graphql';
import { PeriodehistorikkType } from '@spesialist-mock/schemaTypes';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { StansAutomatiskBehandlingMock } from '@spesialist-mock/storage/stansautomatiskbehandling';

export const stub = async (_request: Request, params: Promise<{ pseudoId: string }>) => {
    const { pseudoId } = await params;
    const { begrunnelse, saksbehandlerStans } = await _request.json();

    const oppgaveId = finnOppgaveId();

    if (saksbehandlerStans != undefined) {
        StansAutomatiskBehandlingMock.stansAutomatiskBehandling(pseudoId, saksbehandlerStans);
        if (oppgaveId) {
            HistorikkinnslagMock.addHistorikkinnslag(oppgaveId, {
                type: saksbehandlerStans
                    ? PeriodehistorikkType.StansAutomatiskBehandlingSaksbehandler
                    : PeriodehistorikkType.OpphevStansAutomatiskBehandlingSaksbehandler,
                notattekst: begrunnelse,
                dialogRef: DialogMock.addDialog(),
            });
        }
    }

    return Response.json({ status: 200 });
};

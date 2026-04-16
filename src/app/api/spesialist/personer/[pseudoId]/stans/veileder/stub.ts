import { finnOppgaveId } from '@spesialist-mock/graphql';
import { PeriodehistorikkType } from '@spesialist-mock/schemaTypes';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { VeilederStansMock } from '@spesialist-mock/storage/veilederstans';

export async function getStub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;

    return Response.json(
        VeilederStansMock.getVeilederStans(pseudoId) ?? {
            erStanset: false,
            årsaker: [],
            tidspunkt: null,
        },
    );
}

export async function patchStub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const { begrunnelse, stans } = await _request.json();

    if (stans) {
        return Response.json(
            {
                type: 'about:blank',
                status: 400,
                title: 'Error - Det er ikke meningen å opprette veilederstans fra Speil',
                code: 'KAN_IKKE_OPPRETTE_VEILEDER_STANS',
            },
            { status: 400 },
        );
    }

    VeilederStansMock.opphevStans(pseudoId);

    const oppgaveId = finnOppgaveId();

    if (oppgaveId) {
        HistorikkinnslagMock.addHistorikkinnslag(oppgaveId, {
            type: PeriodehistorikkType.OpphevStansAutomatiskBehandlingSaksbehandler,
            notattekst: begrunnelse,
            dialogRef: DialogMock.addDialog(),
        });
    }

    return Response.json({ status: 200 });
}

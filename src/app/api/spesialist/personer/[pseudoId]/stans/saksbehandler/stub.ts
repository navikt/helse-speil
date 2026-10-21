import { ApiPeriodehistorikkType } from '@io/rest/generated/spesialist.schemas';
import { lokalSaksbehandlerIdent } from '@spesialist-mock/constants';
import { finnOppgaveId } from '@spesialist-mock/saksbilde';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { SaksbehandlerStansMock } from '@spesialist-mock/storage/saksbehandlerstans';

export async function patchStub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const { begrunnelse, stans } = await _request.json();

    const oppgaveId = finnOppgaveId();

    if (stans) {
        SaksbehandlerStansMock.opprettStans(pseudoId, begrunnelse, lokalSaksbehandlerIdent);
    } else {
        SaksbehandlerStansMock.opphevStans(pseudoId);
    }

    if (oppgaveId) {
        HistorikkinnslagMock.addHistorikkinnslag(oppgaveId, {
            historikktype: stans
                ? ApiPeriodehistorikkType.STANS_AUTOMATISK_BEHANDLING_SAKSBEHANDLER
                : ApiPeriodehistorikkType.OPPHEV_STANS_AUTOMATISK_BEHANDLING_SAKSBEHANDLER,
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

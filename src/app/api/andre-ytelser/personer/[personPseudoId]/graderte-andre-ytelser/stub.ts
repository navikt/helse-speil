import {
    endreGraderteAndreYtelser,
    feiltitler,
    hentGraderteAndreYtelser,
    personFinnes,
} from '@app/api/andre-ytelser/andreYtelserMock';
import {
    ApiEndreGraderteAndreYtelserRequest,
    ApiEndreGraderteAndreYtelserResponse,
} from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { problemDetails } from '@spesialist-mock/problemDetails';
import { registrerEndringAvGraderteAndreYtelser } from '@spesialist-mock/saksbehandling';

export async function getStub(_request: Request, params: Promise<{ personPseudoId: string }>) {
    const { personPseudoId } = await params;
    if (!personFinnes(personPseudoId)) return problemDetails(404, null, 'Ikke funnet');
    return Response.json(hentGraderteAndreYtelser(personPseudoId));
}

export async function postStub(request: Request, params: Promise<{ personPseudoId: string }>) {
    const { personPseudoId } = await params;
    if (!personFinnes(personPseudoId)) return problemDetails(404, null, 'Ikke funnet');

    const body: ApiEndreGraderteAndreYtelserRequest = await request.json();
    const resultat = endreGraderteAndreYtelser(personPseudoId, body);
    if (resultat.type === 'FEIL') {
        const status = resultat.code === 'UTDATERT_TILSTAND' ? 409 : 400;
        return problemDetails(status, resultat.code, feiltitler[resultat.code]);
    }

    // sp-andre-ytelser sender saksbehandlerhandlingen til spesialist via outbox, med versjonen som handlingId
    if (resultat.event) {
        registrerEndringAvGraderteAndreYtelser(personPseudoId, resultat.event.versjon, body.behandlingId);
    }

    const response: ApiEndreGraderteAndreYtelserResponse = { versjon: resultat.versjon };
    return Response.json(response);
}

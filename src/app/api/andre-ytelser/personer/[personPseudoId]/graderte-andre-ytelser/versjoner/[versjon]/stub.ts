import { hentGraderteAndreYtelserVedVersjon, personFinnes } from '@app/api/andre-ytelser/andreYtelserMock';
import { problemDetails } from '@spesialist-mock/problemDetails';

export async function stub(_request: Request, params: Promise<{ personPseudoId: string; versjon: string }>) {
    const { personPseudoId, versjon } = await params;
    if (!personFinnes(personPseudoId)) return problemDetails(404, null, 'Ikke funnet');
    const graderteAndreYtelser = hentGraderteAndreYtelserVedVersjon(personPseudoId, versjon);
    if (!graderteAndreYtelser) return problemDetails(404, null, 'Fant ikke versjonen');
    return Response.json(graderteAndreYtelser);
}

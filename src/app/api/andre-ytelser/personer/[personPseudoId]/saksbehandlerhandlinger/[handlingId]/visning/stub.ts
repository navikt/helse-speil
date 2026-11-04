import { hentVisning, personFinnes } from '@app/api/andre-ytelser/andreYtelserMock';
import { problemDetails } from '@spesialist-mock/problemDetails';

export async function stub(_request: Request, params: Promise<{ personPseudoId: string; handlingId: string }>) {
    const { personPseudoId, handlingId } = await params;
    if (!personFinnes(personPseudoId)) return problemDetails(404, null, 'Ikke funnet');
    const visning = hentVisning(personPseudoId, handlingId);
    if (!visning) return problemDetails(404, null, 'Fant ikke detaljer');
    return Response.json(visning);
}

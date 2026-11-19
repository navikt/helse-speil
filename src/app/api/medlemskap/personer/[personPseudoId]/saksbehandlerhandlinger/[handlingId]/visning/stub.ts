import { hentVisning } from '@app/api/medlemskap/personer/[personPseudoId]/vilkarsvurderinger/medlemskapMock';
import { problemDetails } from '@spesialist-mock/problemDetails';
import { PersonMock } from '@spesialist-mock/storage/person';

export async function stub(_request: Request, params: Promise<{ personPseudoId: string; handlingId: string }>) {
    const { personPseudoId, handlingId } = await params;
    if (PersonMock.findFødselsnummerForPersonPseudoId(personPseudoId) === null) {
        return problemDetails(404, null, 'Person ikke funnet');
    }
    const visning = hentVisning(personPseudoId, handlingId);
    if (!visning) return problemDetails(404, null, 'Fant ikke detaljer');
    return Response.json(visning);
}

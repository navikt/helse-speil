import {
    ApiGetTildelingForPersonErrorCode,
    ApiHttpProblemDetailsApiGetTildelingForPersonErrorCode,
    ApiTildelingForPerson,
} from '@io/rest/generated/spesialist.schemas';
import { hentSaksbilde } from '@spesialist-mock/saksbilde';

export async function getStub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const saksbilde = hentSaksbilde(pseudoId);
    if (!saksbilde) {
        const body: ApiHttpProblemDetailsApiGetTildelingForPersonErrorCode = {
            type: 'about:blank',
            status: 404,
            title: 'PersonPseudoId har utløpt (eller aldri eksistert)',
            code: ApiGetTildelingForPersonErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET,
        };
        return Response.json(body, { status: 404 });
    }

    const body: ApiTildelingForPerson = { tildeling: saksbilde.tildeling ?? null };
    return Response.json(body, { status: 200 });
}

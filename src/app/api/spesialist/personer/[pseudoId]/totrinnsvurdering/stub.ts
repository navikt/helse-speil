import {
    ApiGetTotrinnsvurderingForPersonErrorCode,
    ApiHttpProblemDetailsApiGetTotrinnsvurderingForPersonErrorCode,
    ApiTotrinnsvurderingForPerson,
} from '@io/rest/generated/spesialist.schemas';
import { hentSaksbilde } from '@spesialist-mock/saksbilde';
import { finnTotrinnsvurdering } from '@spesialist-mock/storage/aktivOppgave';

export async function stub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const saksbilde = hentSaksbilde(pseudoId);
    if (!saksbilde) {
        const body: ApiHttpProblemDetailsApiGetTotrinnsvurderingForPersonErrorCode = {
            type: 'about:blank',
            status: 404,
            title: 'PersonPseudoId har utløpt (eller aldri eksistert)',
            code: ApiGetTotrinnsvurderingForPersonErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET,
        };
        return Response.json(body, { status: 404 });
    }

    const body: ApiTotrinnsvurderingForPerson = { totrinnsvurdering: finnTotrinnsvurdering(saksbilde.fodselsnummer) };
    return Response.json(body, { status: 200 });
}

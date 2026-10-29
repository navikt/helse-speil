import {
    ApiGetPaVentForPersonErrorCode,
    ApiHttpProblemDetailsApiGetPaVentForPersonErrorCode,
    ApiPaVentForPerson,
} from '@io/rest/generated/spesialist.schemas';
import { hentSaksbilde } from '@spesialist-mock/saksbilde';
import { finnPåVent } from '@spesialist-mock/storage/aktivOppgave';

// Som i spesialist: påVent på vedtaksperioden til den aktive oppgaven
export async function stub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const saksbilde = hentSaksbilde(pseudoId);
    if (!saksbilde) {
        const body: ApiHttpProblemDetailsApiGetPaVentForPersonErrorCode = {
            type: 'about:blank',
            status: 404,
            title: 'PersonPseudoId har utløpt (eller aldri eksistert)',
            code: ApiGetPaVentForPersonErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET,
        };
        return Response.json(body, { status: 404 });
    }

    const body: ApiPaVentForPerson = { paVent: finnPåVent(saksbilde.fodselsnummer) };
    return Response.json(body, { status: 200 });
}

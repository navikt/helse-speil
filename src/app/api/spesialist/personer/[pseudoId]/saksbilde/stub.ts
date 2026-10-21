import {
    ApiGetSaksbildeForPersonErrorCode,
    ApiHttpProblemDetailsApiGetSaksbildeForPersonErrorCode,
} from '@io/rest/generated/spesialist.schemas';
import { hentSaksbilde } from '@spesialist-mock/saksbilde';

const PERSON_SOM_IKKE_ER_KLAR = '64b51f30-2f3f-4872-afb9-8f7f31ab6c36';
const PERSON_SOM_MANGLER_AVVIKSVURDERING = 'b99b7845-f892-484c-b1d8-e070d2821bb6';

export async function stub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    if (pseudoId === PERSON_SOM_IKKE_ER_KLAR || pseudoId === PERSON_SOM_MANGLER_AVVIKSVURDERING) {
        return problem(
            500,
            'Feil ved henting av snapshot for person',
            ApiGetSaksbildeForPersonErrorCode.SNAPSHOT_KUNNE_IKKE_HENTES,
        );
    }

    const saksbilde = hentSaksbilde(pseudoId);
    if (!saksbilde) {
        return problem(
            404,
            'PersonPseudoId har utløpt (eller aldri eksistert)',
            ApiGetSaksbildeForPersonErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET,
        );
    }

    return Response.json(saksbilde, { status: 200 });
}

function problem(status: number, title: string, code: ApiGetSaksbildeForPersonErrorCode) {
    const body: ApiHttpProblemDetailsApiGetSaksbildeForPersonErrorCode = { type: 'about:blank', status, title, code };
    return Response.json(body, { status });
}

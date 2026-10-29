import {
    ApiGetPaVentForPersonErrorCode,
    ApiHttpProblemDetailsApiGetPaVentForPersonErrorCode,
    ApiPaVentForPerson,
} from '@io/rest/generated/spesialist.schemas';
import { finnPerioderMedOppgave } from '@spesialist-mock/periodeoppslag';
import { hentSaksbilde } from '@spesialist-mock/saksbilde';

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

    const periodeMedOppgave = finnPerioderMedOppgave(saksbilde.fodselsnummer)[0]?.periode;
    const body: ApiPaVentForPerson = { paVent: periodeMedOppgave?.paVent ?? null };
    return Response.json(body, { status: 200 });
}

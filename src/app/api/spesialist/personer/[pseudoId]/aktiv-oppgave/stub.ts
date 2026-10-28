import {
    ApiAktivOppgaveForPerson,
    ApiGetAktivOppgaveForPersonErrorCode,
    ApiHttpProblemDetailsApiGetAktivOppgaveForPersonErrorCode,
} from '@io/rest/generated/spesialist.schemas';
import { finnAktivOppgave, hentSaksbilde } from '@spesialist-mock/saksbilde';

export async function stub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const saksbilde = hentSaksbilde(pseudoId);
    if (!saksbilde) {
        const body: ApiHttpProblemDetailsApiGetAktivOppgaveForPersonErrorCode = {
            type: 'about:blank',
            status: 404,
            title: 'PersonPseudoId har utløpt (eller aldri eksistert)',
            code: ApiGetAktivOppgaveForPersonErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET,
        };
        return Response.json(body, { status: 404 });
    }

    const body: ApiAktivOppgaveForPerson = { aktivOppgave: finnAktivOppgave(saksbilde) };
    return Response.json(body, { status: 200 });
}

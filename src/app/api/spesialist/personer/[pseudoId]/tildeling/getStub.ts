import {
    ApiGetTildelingForPersonErrorCode,
    ApiHttpProblemDetailsApiGetTildelingForPersonErrorCode,
    ApiTildelingForPerson,
} from '@io/rest/generated/spesialist.schemas';
import { finnTildeling } from '@spesialist-mock/storage/aktivOppgave';
import { PersonMock } from '@spesialist-mock/storage/person';

export async function getStub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
    if (!fødselsnummer) {
        const body: ApiHttpProblemDetailsApiGetTildelingForPersonErrorCode = {
            type: 'about:blank',
            status: 404,
            title: 'PersonPseudoId har utløpt (eller aldri eksistert)',
            code: ApiGetTildelingForPersonErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET,
        };
        return Response.json(body, { status: 404 });
    }

    const body: ApiTildelingForPerson = { tildeling: finnTildeling(fødselsnummer) };
    return Response.json(body, { status: 200 });
}

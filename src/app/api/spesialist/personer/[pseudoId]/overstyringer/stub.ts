import {
    ApiGetOverstyringerForPersonErrorCode,
    ApiHttpProblemDetailsApiGetOverstyringerForPersonErrorCode,
    ApiOverstyringerForPerson,
} from '@io/rest/generated/spesialist.schemas';
import { OverstyringMock } from '@spesialist-mock/storage/overstyring';
import { PersonMock, finnTestpersonfil } from '@spesialist-mock/storage/person';

export async function stub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
    if (!fødselsnummer) {
        const body: ApiHttpProblemDetailsApiGetOverstyringerForPersonErrorCode = {
            type: 'about:blank',
            status: 404,
            title: 'PersonPseudoId har utløpt (eller aldri eksistert)',
            code: ApiGetOverstyringerForPersonErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET,
        };
        return Response.json(body, { status: 404 });
    }

    const body: ApiOverstyringerForPerson = {
        overstyringer: [
            ...(finnTestpersonfil(fødselsnummer)?.overstyringer ?? []),
            ...OverstyringMock.hentForPerson(fødselsnummer),
        ],
    };
    return Response.json(body, { status: 200 });
}

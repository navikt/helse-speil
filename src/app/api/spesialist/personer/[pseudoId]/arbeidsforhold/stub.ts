import {
    ApiArbeidsforholdForPerson,
    ApiGetArbeidsforholdForPersonErrorCode,
    ApiHttpProblemDetailsApiGetArbeidsforholdForPersonErrorCode,
} from '@io/rest/generated/spesialist.schemas';
import { PersonMock, finnTestpersonfil } from '@spesialist-mock/storage/person';

export async function stub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
    if (!fødselsnummer) {
        const body: ApiHttpProblemDetailsApiGetArbeidsforholdForPersonErrorCode = {
            type: 'about:blank',
            status: 404,
            title: 'PersonPseudoId har utløpt (eller aldri eksistert)',
            code: ApiGetArbeidsforholdForPersonErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET,
        };
        return Response.json(body, { status: 404 });
    }

    const body: ApiArbeidsforholdForPerson[] = finnTestpersonfil(fødselsnummer)?.arbeidsforhold ?? [];
    return Response.json(body, { status: 200 });
}

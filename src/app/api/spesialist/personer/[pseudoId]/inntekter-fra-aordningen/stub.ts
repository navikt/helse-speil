import {
    ApiGetInntekterFraAordningenForPersonErrorCode,
    ApiHttpProblemDetailsApiGetInntekterFraAordningenForPersonErrorCode,
    ApiInntekterFraAordningenForArbeidsgiver,
} from '@io/rest/generated/spesialist.schemas';
import { PersonMock, finnTestpersonfil } from '@spesialist-mock/storage/person';

export async function stub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
    if (!fødselsnummer) {
        const body: ApiHttpProblemDetailsApiGetInntekterFraAordningenForPersonErrorCode = {
            type: 'about:blank',
            status: 404,
            title: 'PersonPseudoId har utløpt (eller aldri eksistert)',
            code: ApiGetInntekterFraAordningenForPersonErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET,
        };
        return Response.json(body, { status: 404 });
    }

    const body: ApiInntekterFraAordningenForArbeidsgiver[] =
        finnTestpersonfil(fødselsnummer)?.inntekterFraAordningen ?? [];
    return Response.json(body, { status: 200 });
}

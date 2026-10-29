import {
    ApiGetInntekterFraAordningenForPersonErrorCode,
    ApiHttpProblemDetailsApiGetInntekterFraAordningenForPersonErrorCode,
    ApiInntekterFraAordningenForArbeidsgiver,
} from '@io/rest/generated/spesialist.schemas';
import { hentSaksbilde } from '@spesialist-mock/saksbilde';

export async function stub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const saksbilde = hentSaksbilde(pseudoId);
    if (!saksbilde) {
        const body: ApiHttpProblemDetailsApiGetInntekterFraAordningenForPersonErrorCode = {
            type: 'about:blank',
            status: 404,
            title: 'PersonPseudoId har utløpt (eller aldri eksistert)',
            code: ApiGetInntekterFraAordningenForPersonErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET,
        };
        return Response.json(body, { status: 404 });
    }

    const body: ApiInntekterFraAordningenForArbeidsgiver[] = saksbilde.arbeidsgivere.flatMap((arbeidsgiver) =>
        arbeidsgiver.inntekterFraAordningen.map((inntekter) => ({
            organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
            ...inntekter,
        })),
    );
    return Response.json(body, { status: 200 });
}

import {
    ApiArbeidsforholdForPerson,
    ApiGetArbeidsforholdForPersonErrorCode,
    ApiHttpProblemDetailsApiGetArbeidsforholdForPersonErrorCode,
} from '@io/rest/generated/spesialist.schemas';
import { hentSaksbilde } from '@spesialist-mock/saksbilde';

export async function stub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const saksbilde = hentSaksbilde(pseudoId);
    if (!saksbilde) {
        const body: ApiHttpProblemDetailsApiGetArbeidsforholdForPersonErrorCode = {
            type: 'about:blank',
            status: 404,
            title: 'PersonPseudoId har utløpt (eller aldri eksistert)',
            code: ApiGetArbeidsforholdForPersonErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET,
        };
        return Response.json(body, { status: 404 });
    }

    const body: ApiArbeidsforholdForPerson[] = saksbilde.arbeidsgivere.flatMap((arbeidsgiver) =>
        arbeidsgiver.arbeidsforhold.map((arbeidsforhold) => ({
            organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
            ...arbeidsforhold,
        })),
    );
    return Response.json(body, { status: 200 });
}

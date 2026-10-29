import {
    ApiGetOverstyringerForPersonErrorCode,
    ApiHttpProblemDetailsApiGetOverstyringerForPersonErrorCode,
    ApiOverstyring,
    ApiOverstyringerForPerson,
} from '@io/rest/generated/spesialist.schemas';
import { OverstyringMock } from '@spesialist-mock/storage/overstyring';
import { PersonMock, SELVSTENDIG_NÆRING, finnTestpersonfil } from '@spesialist-mock/storage/person';

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
            ...overstyringerFraTestpersonfil(fødselsnummer),
            ...OverstyringMock.hentForPerson(fødselsnummer),
        ],
    };
    return Response.json(body, { status: 200 });
}

const overstyringerFraTestpersonfil = (fødselsnummer: string): ApiOverstyring[] => {
    const saksbilde = finnTestpersonfil(fødselsnummer)?.saksbilde;
    if (!saksbilde) return [];
    const medOrganisasjonsnummer = (overstyringer: ApiOverstyring[], organisasjonsnummer: string) =>
        overstyringer.map((it) => ({ ...it, organisasjonsnummer }));
    return [
        ...saksbilde.arbeidsgivere.flatMap((it) => medOrganisasjonsnummer(it.overstyringer, it.organisasjonsnummer)),
        ...medOrganisasjonsnummer(saksbilde.selvstendigNaering?.overstyringer ?? [], SELVSTENDIG_NÆRING),
    ];
};

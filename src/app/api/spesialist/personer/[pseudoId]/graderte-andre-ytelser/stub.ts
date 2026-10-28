import {
    ApiEndreGraderteAndreYtelserRequest,
    ApiEndreGraderteAndreYtelserResponse,
    ApiGetGraderteAndreYtelserForPersonErrorCode,
    ApiPostGraderteAndreYtelserErrorCode,
} from '@io/rest/generated/spesialist.schemas';
import { problemDetails } from '@spesialist-mock/problemDetails';
import { GraderteAndreYtelserMock } from '@spesialist-mock/storage/graderteAndreYtelser';
import { PersonMock } from '@spesialist-mock/storage/person';

const feilmeldinger: Record<ApiPostGraderteAndreYtelserErrorCode, { status: number; title: string }> = {
    PERSON_PSEUDO_ID_IKKE_FUNNET: { status: 400, title: 'Person ikke funnet' },
    MANGLER_TILGANG_TIL_PERSON: { status: 403, title: 'Mangler tilgang til person' },
    TOTAL_GRAD_OVER_100: { status: 400, title: 'Total grad for en dag kan ikke overstige 100' },
    MANGLER_ENDRINGER: { status: 400, title: 'Mangler endringer' },
    NEGATIV_GRAD: { status: 400, title: 'Grad kan ikke være negativ' },
    UTDATERT_TILSTAND: { status: 409, title: 'Graderte andre ytelser er endret siden de ble hentet' },
};

export async function getStub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
    if (fødselsnummer === null) {
        return problemDetails(
            400,
            ApiGetGraderteAndreYtelserForPersonErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET,
            'Person ikke funnet',
        );
    }
    return Response.json(GraderteAndreYtelserMock.hent(fødselsnummer));
}

export async function postStub(request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
    if (fødselsnummer === null) return feil(ApiPostGraderteAndreYtelserErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET);

    const body: ApiEndreGraderteAndreYtelserRequest = await request.json();
    const resultat = GraderteAndreYtelserMock.endre(fødselsnummer, body);
    if (resultat.type === 'FEIL') return feil(resultat.code);

    const response: ApiEndreGraderteAndreYtelserResponse = { versjon: resultat.versjon };
    return Response.json(response);
}

function feil(code: ApiPostGraderteAndreYtelserErrorCode) {
    const { status, title } = feilmeldinger[code];
    return problemDetails(status, code, title);
}

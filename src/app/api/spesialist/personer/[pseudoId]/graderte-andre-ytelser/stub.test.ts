import {
    ApiEndreGraderteAndreYtelserRequest,
    ApiGraderteAndreYtelser,
    ApiPostGraderteAndreYtelserErrorCode,
} from '@io/rest/generated/spesialist.schemas';
import { GraderteAndreYtelserMock } from '@spesialist-mock/storage/graderteAndreYtelser';
import { PersonMock } from '@spesialist-mock/storage/person';

import { getStub, postStub } from './stub';

const pseudoId = PersonMock.findPersonPseudoId('19886497256')!;
const behandlingId = '94926180-4e95-4879-8975-0a63b5659831';

const lagRequest = (
    overstyringer: Partial<ApiEndreGraderteAndreYtelserRequest> = {},
): ApiEndreGraderteAndreYtelserRequest => ({
    yrkesaktivitet: 'ARBEIDSTAKER',
    organisasjonsnummer: '967170232',
    versjon: null,
    behandlingId,
    notatTilBeslutter: 'Et notat',
    dager: [{ dato: '2024-07-01', andreYtelserGrader: { FORELDREPENGER: 40 }, sykdomsgrad: 30, arbeidsgrad: 30 }],
    ...overstyringer,
});

const post = (body: ApiEndreGraderteAndreYtelserRequest, id = pseudoId) =>
    postStub(
        new Request('http://localhost', { method: 'POST', body: JSON.stringify(body) }),
        Promise.resolve({ pseudoId: id }),
    );

const hent = async (): Promise<ApiGraderteAndreYtelser[]> =>
    (await getStub(new Request('http://localhost'), Promise.resolve({ pseudoId }))).json();

describe('graderte andre ytelser-stub', () => {
    beforeEach(() => GraderteAndreYtelserMock.nullstill());

    it('oppretter strøm ved første POST og returnerer versjonen', async () => {
        const response = await post(lagRequest());

        expect(response.status).toBe(200);
        const { versjon } = await response.json();
        const [strøm] = await hent();
        expect(strøm).toMatchObject({ yrkesaktivitet: 'ARBEIDSTAKER', organisasjonsnummer: '967170232', versjon });
        expect(strøm!.events).toHaveLength(1);
        expect(strøm!.events[0]!.dager[0]).toMatchObject({ fraSykdomsgrad: null, fraAndreYtelserGrader: null });
    });

    it('endrer bare dagene i requesten og fyller inn fra-verdier', async () => {
        const { versjon } = await (
            await post(
                lagRequest({
                    dager: [
                        {
                            dato: '2024-07-01',
                            andreYtelserGrader: { FORELDREPENGER: 40 },
                            sykdomsgrad: 30,
                            arbeidsgrad: 30,
                        },
                        {
                            dato: '2024-07-02',
                            andreYtelserGrader: { FORELDREPENGER: 40 },
                            sykdomsgrad: 30,
                            arbeidsgrad: 30,
                        },
                    ],
                }),
            )
        ).json();

        const response = await post(
            lagRequest({
                versjon,
                dager: [
                    { dato: '2024-07-02', andreYtelserGrader: { PLEIEPENGER: 20 }, sykdomsgrad: 50, arbeidsgrad: 30 },
                ],
            }),
        );

        expect(response.status).toBe(200);
        const [strøm] = await hent();
        expect(strøm!.dager.map((dag) => dag.andreYtelserGrader)).toEqual([
            { FORELDREPENGER: 40 },
            { PLEIEPENGER: 20 },
        ]);
        expect(strøm!.events[1]!.dager).toEqual([
            {
                dato: '2024-07-02',
                andreYtelserGrader: { PLEIEPENGER: 20 },
                sykdomsgrad: 50,
                arbeidsgrad: 30,
                fraAndreYtelserGrader: { FORELDREPENGER: 40 },
                fraSykdomsgrad: 30,
                fraArbeidsgrad: 30,
            },
        ]);
    });

    it('lagrer ikke ny versjon når alle dagene er like', async () => {
        const { versjon } = await (await post(lagRequest())).json();

        const response = await post(lagRequest({ versjon }));

        expect(await response.json()).toEqual({ versjon });
        expect((await hent())[0]!.events).toHaveLength(1);
    });

    it('holder strømmer for ulike arbeidsgivere adskilt', async () => {
        await post(lagRequest());
        await post(lagRequest({ organisasjonsnummer: '947064649' }));

        expect(await hent()).toHaveLength(2);
    });

    it.each([
        [ApiPostGraderteAndreYtelserErrorCode.MANGLER_ENDRINGER, lagRequest({ dager: [] })],
        [
            ApiPostGraderteAndreYtelserErrorCode.NEGATIV_GRAD,
            lagRequest({
                dager: [
                    {
                        dato: '2024-07-01',
                        andreYtelserGrader: { FORELDREPENGER: -1 },
                        sykdomsgrad: 30,
                        arbeidsgrad: 30,
                    },
                ],
            }),
        ],
        [
            ApiPostGraderteAndreYtelserErrorCode.TOTAL_GRAD_OVER_100,
            lagRequest({
                dager: [
                    {
                        dato: '2024-07-01',
                        andreYtelserGrader: { FORELDREPENGER: 50 },
                        sykdomsgrad: 30,
                        arbeidsgrad: 30,
                    },
                ],
            }),
        ],
    ])('svarer 400 med %s', async (code, request) => {
        const response = await post(request);

        expect(response.status).toBe(400);
        expect(await response.json()).toMatchObject({ code });
        expect(await hent()).toEqual([]);
    });

    it.each([
        ['utdatert versjon', 'ny-versjon-finnes'],
        ['manglende versjon for eksisterende strøm', null],
    ])('svarer 409 ved %s', async (_, versjon) => {
        await post(lagRequest());

        const response = await post(lagRequest({ versjon }));

        expect(response.status).toBe(409);
        expect(await response.json()).toMatchObject({ code: ApiPostGraderteAndreYtelserErrorCode.UTDATERT_TILSTAND });
        expect((await hent())[0]!.events).toHaveLength(1);
    });

    it('svarer 409 når versjon sendes for en strøm som ikke finnes', async () => {
        const response = await post(lagRequest({ versjon: '0190a1b2-0000-7000-8000-000000000000' }));

        expect(response.status).toBe(409);
        expect(await hent()).toEqual([]);
    });

    it('svarer 400 når personen ikke finnes', async () => {
        const response = await post(lagRequest(), 'ukjent');

        expect(response.status).toBe(400);
        expect(await response.json()).toMatchObject({
            code: ApiPostGraderteAndreYtelserErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET,
        });
    });
});

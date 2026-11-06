import { nullstillGraderteAndreYtelser } from '@app/api/andre-ytelser/andreYtelserMock';
import {
    ApiEndreGraderteAndreYtelserRequest,
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserDag,
} from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { ApiHandlingType } from '@io/rest/generated/spesialist.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';
import { SaksbehandlerhandlingMock } from '@spesialist-mock/storage/saksbehandlerhandling';

import { getStub, postStub } from './stub';

const personPseudoId = PersonMock.findPersonPseudoId('19886497256')!;
const behandlingId = '94926180-4e95-4879-8975-0a63b5659831';

const lagDag = (overstyringer: Partial<ApiGraderteAndreYtelserDag> = {}): ApiGraderteAndreYtelserDag => ({
    dato: '2024-07-01',
    andreYtelserGrader: { FORELDREPENGER: 40 },
    sykdomsgrad: 30,
    arbeidsgrad: 30,
    sykdomsgradFørFordeling: 70,
    begrunnelse: 'En begrunnelse',
    ...overstyringer,
});

const lagRequest = (
    overstyringer: Partial<ApiEndreGraderteAndreYtelserRequest> = {},
): ApiEndreGraderteAndreYtelserRequest => ({
    yrkesaktivitet: 'ARBEIDSTAKER',
    organisasjonsnummer: '967170232',
    versjon: null,
    behandlingId,
    dager: [lagDag()],
    ...overstyringer,
});

const post = (body: ApiEndreGraderteAndreYtelserRequest, id = personPseudoId) =>
    postStub(
        new Request('http://localhost/api/andre-ytelser', { method: 'POST', body: JSON.stringify(body) }),
        Promise.resolve({ personPseudoId: id }),
    );

const lagre = async (body: ApiEndreGraderteAndreYtelserRequest): Promise<string> =>
    (await (await post(body)).json()).versjon;

const get = (id = personPseudoId) => getStub(new Request('http://localhost'), Promise.resolve({ personPseudoId: id }));

const hent = async (): Promise<ApiGraderteAndreYtelser[]> => (await get()).json();

describe('graderte andre ytelser-stub', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        nullstillGraderteAndreYtelser();
        SaksbehandlerhandlingMock.nullstill();
    });

    afterEach(() => vi.useRealTimers());

    it('lagrer en ny fordeling med versjon og en hendelse uten fra-verdier', async () => {
        const versjon = await lagre(lagRequest());

        const [graderteAndreYtelser] = await hent();
        expect(graderteAndreYtelser).toMatchObject({
            yrkesaktivitet: 'ARBEIDSTAKER',
            organisasjonsnummer: '967170232',
            versjon,
            dager: [lagDag()],
        });
        expect(graderteAndreYtelser!.events).toHaveLength(1);
        expect(graderteAndreYtelser!.events[0]).toMatchObject({
            versjon,
            utfortAvSaksbehandlerIdent: 'S123456',
        });
        expect(graderteAndreYtelser!.events[0]!.dager[0]).toMatchObject({
            fraAndreYtelserGrader: null,
            fraSykdomsgrad: null,
            fraArbeidsgrad: null,
            fraSykdomsgradFørFordeling: null,
        });
    });

    it('lagrer fordelinger per yrkesaktivitet', async () => {
        await lagre(lagRequest());
        await lagre(lagRequest({ yrkesaktivitet: 'SELVSTENDIG', organisasjonsnummer: null }));

        expect((await hent()).map((it) => it.yrkesaktivitet)).toEqual(['ARBEIDSTAKER', 'SELVSTENDIG']);
    });

    it('endrer bare dagene i forespørselen og fyller inn fra-verdiene', async () => {
        const versjon = await lagre(lagRequest({ dager: [lagDag(), lagDag({ dato: '2024-07-02' })] }));

        const nyVersjon = await lagre(
            lagRequest({
                versjon,
                dager: [
                    lagDag(),
                    lagDag({
                        dato: '2024-07-02',
                        andreYtelserGrader: { PLEIEPENGER: 20 },
                        sykdomsgrad: 40,
                        arbeidsgrad: 40,
                        sykdomsgradFørFordeling: 60,
                    }),
                ],
            }),
        );

        const [graderteAndreYtelser] = await hent();
        expect(nyVersjon).not.toBe(versjon);
        expect(graderteAndreYtelser!.versjon).toBe(nyVersjon);
        expect(graderteAndreYtelser!.dager).toHaveLength(2);
        expect(graderteAndreYtelser!.events[1]!.dager).toEqual([
            {
                dato: '2024-07-02',
                andreYtelserGrader: { PLEIEPENGER: 20 },
                sykdomsgrad: 40,
                arbeidsgrad: 40,
                sykdomsgradFørFordeling: 60,
                begrunnelse: 'En begrunnelse',
                fraAndreYtelserGrader: { FORELDREPENGER: 40 },
                fraSykdomsgrad: 30,
                fraArbeidsgrad: 30,
                fraSykdomsgradFørFordeling: 70,
            },
        ]);
    });

    it('gir samme versjon og ingen ny hendelse når forespørselen ikke endrer noe', async () => {
        const versjon = await lagre(lagRequest());

        const response = await post(lagRequest({ versjon }));

        expect(response.status).toBe(200);
        expect((await response.json()).versjon).toBe(versjon);
        expect((await hent())[0]!.events).toHaveLength(1);
        expect(
            SaksbehandlerhandlingMock.hentHandlinger(personPseudoId).filter(
                (it) => it.handlingType === ApiHandlingType.GRADERTE_ANDRE_YTELSER_ENDRET,
            ),
        ).toHaveLength(1);
    });

    it('registrerer en saksbehandlerhandling som krever totrinnsvurdering', async () => {
        const versjon = await lagre(lagRequest());

        expect(
            SaksbehandlerhandlingMock.hentHandlinger(personPseudoId).find((it) => it.handlingId === versjon),
        ).toMatchObject({
            handlingType: ApiHandlingType.GRADERTE_ANDRE_YTELSER_ENDRET,
            behandlingId,
            erDelAvAktivTotrinnsvurdering: true,
        });
    });

    it('svarer 409 UTDATERT_TILSTAND når versjonen ikke er den nyeste', async () => {
        await lagre(lagRequest());

        const response = await post(lagRequest({ versjon: crypto.randomUUID() }));

        expect(response.status).toBe(409);
        expect(await response.json()).toMatchObject({ status: 409, code: 'UTDATERT_TILSTAND' });
    });

    it('svarer 409 UTDATERT_TILSTAND når forespørselen mangler versjon og fordelingen finnes', async () => {
        await lagre(lagRequest());

        expect((await post(lagRequest())).status).toBe(409);
    });

    it.each([
        ['MANGLER_ENDRINGER', []],
        ['GRAD_UTENFOR_GRENSER', [lagDag({ sykdomsgradFørFordeling: 0, sykdomsgrad: 0, arbeidsgrad: 60 })]],
        [
            'GRAD_UTENFOR_GRENSER',
            [lagDag({ andreYtelserGrader: { FORELDREPENGER: 100 }, sykdomsgrad: 0, arbeidsgrad: 0 })],
        ],
        ['GRAD_UTENFOR_GRENSER', [lagDag({ sykdomsgrad: 80, arbeidsgrad: -20 })]],
        ['SUM_ER_IKKE_100', [lagDag({ arbeidsgrad: 20 })]],
        ['YTELSER_MANGLER_TREKK', [lagDag({ andreYtelserGrader: {}, sykdomsgrad: 50, arbeidsgrad: 50 })]],
        ['ARBEIDSGRAD_OKER', [lagDag({ sykdomsgrad: 20, arbeidsgrad: 40 })]],
    ] as const)('svarer 400 %s når dagene bryter reglene', async (code, dager) => {
        const response = await post(lagRequest({ dager: [...dager] }));

        expect(response.status).toBe(400);
        expect(await response.json()).toMatchObject({ status: 400, code });
        expect(await hent()).toEqual([]);
    });

    it('godtar at ytelsene fjernes når sykdomsgraden går tilbake til sykdomsgraden før fordeling', async () => {
        const versjon = await lagre(lagRequest());

        const response = await post(
            lagRequest({ versjon, dager: [lagDag({ andreYtelserGrader: {}, sykdomsgrad: 70, arbeidsgrad: 30 })] }),
        );

        expect(response.status).toBe(200);
    });

    it('svarer 404 når personen ikke finnes', async () => {
        expect((await post(lagRequest(), 'finnes-ikke')).status).toBe(404);
        expect((await get('finnes-ikke')).status).toBe(404);
    });
});

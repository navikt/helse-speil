import { endreGraderteAndreYtelser, nullstillGraderteAndreYtelser } from '@app/api/andre-ytelser/andreYtelserMock';
import { ApiEndreGraderteAndreYtelserRequest } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

import { stub } from './stub';

const personPseudoId = PersonMock.findPersonPseudoId('19886497256')!;

const lagRequest = (
    overstyringer: Partial<ApiEndreGraderteAndreYtelserRequest>,
): ApiEndreGraderteAndreYtelserRequest => ({
    yrkesaktivitet: 'ARBEIDSTAKER',
    organisasjonsnummer: '967170232',
    versjon: null,
    behandlingId: '94926180-4e95-4879-8975-0a63b5659831',
    notatTilBeslutter: '',
    dager: [],
    ...overstyringer,
});

const lagreVersjon = (request: ApiEndreGraderteAndreYtelserRequest): string => {
    const resultat = endreGraderteAndreYtelser(personPseudoId, request);
    if (resultat.type !== 'LAGRET') throw Error(`Kunne ikke lagre: ${resultat.code}`);
    return resultat.versjon;
};

const hentVisning = (handlingId: string, id = personPseudoId) =>
    stub(new Request('http://localhost'), Promise.resolve({ personPseudoId: id, handlingId }));

describe('visning av saksbehandlerhandling-stub', () => {
    beforeEach(() => nullstillGraderteAndreYtelser());

    it('viser begrunnelsen og grupperer sammenhengende dager med lik endring', async () => {
        const dag = {
            andreYtelserGrader: { FORELDREPENGER: 40 },
            sykdomsgrad: 30,
            arbeidsgrad: 30,
            sykdomsgradFørFordeling: 70,
        };
        const versjon = lagreVersjon(
            lagRequest({
                notatTilBeslutter: 'Et notat',
                dager: [
                    { dato: '2024-07-01', ...dag },
                    { dato: '2024-07-02', ...dag },
                    { dato: '2024-07-04', ...dag },
                ],
            }),
        );

        const response = await hentVisning(versjon);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            felter: [
                { type: 'TEKST', tittel: 'Begrunnelse', tekst: 'Et notat' },
                {
                    type: 'ENDRINGER',
                    tittel: 'Dager endret',
                    grupper: [
                        {
                            rader: [
                                { navn: 'Dato', fra: null, til: '01.07.2024 - 02.07.2024' },
                                { navn: 'Foreldrepenger', fra: null, til: '40 %' },
                                { navn: 'Sykdomsgrad', fra: null, til: '30 %' },
                                { navn: 'Arbeidsgrad', fra: null, til: '30 %' },
                            ],
                        },
                        {
                            rader: [
                                { navn: 'Dato', fra: null, til: '04.07.2024' },
                                { navn: 'Foreldrepenger', fra: null, til: '40 %' },
                                { navn: 'Sykdomsgrad', fra: null, til: '30 %' },
                                { navn: 'Arbeidsgrad', fra: null, til: '30 %' },
                            ],
                        },
                    ],
                },
            ],
        });
    });

    it('viser fra-verdier bare for grader som er endret, og fjernede ytelser som 0 %', async () => {
        const versjon = lagreVersjon(
            lagRequest({
                dager: [
                    {
                        dato: '2024-07-01',
                        andreYtelserGrader: { FORELDREPENGER: 40 },
                        sykdomsgrad: 30,
                        arbeidsgrad: 30,
                        sykdomsgradFørFordeling: 70,
                    },
                ],
            }),
        );
        const nyVersjon = lagreVersjon(
            lagRequest({
                versjon,
                dager: [
                    {
                        dato: '2024-07-01',
                        andreYtelserGrader: { PLEIEPENGER: 40 },
                        sykdomsgrad: 30,
                        arbeidsgrad: 30,
                        sykdomsgradFørFordeling: 70,
                    },
                ],
            }),
        );

        const { felter } = await (await hentVisning(nyVersjon)).json();

        expect(felter).toEqual([
            {
                type: 'ENDRINGER',
                tittel: 'Dager endret',
                grupper: [
                    {
                        rader: [
                            { navn: 'Dato', fra: null, til: '01.07.2024' },
                            { navn: 'Foreldrepenger', fra: '40 %', til: '0 %' },
                            { navn: 'Pleiepenger', fra: '0 %', til: '40 %' },
                            { navn: 'Sykdomsgrad', fra: null, til: '30 %' },
                            { navn: 'Arbeidsgrad', fra: null, til: '30 %' },
                        ],
                    },
                ],
            },
        ]);
    });

    it('svarer 404 for ukjent handling og for ukjent person', async () => {
        const versjon = lagreVersjon(
            lagRequest({
                dager: [
                    {
                        dato: '2024-07-01',
                        andreYtelserGrader: { FORELDREPENGER: 40 },
                        sykdomsgrad: 30,
                        arbeidsgrad: 30,
                        sykdomsgradFørFordeling: 70,
                    },
                ],
            }),
        );

        expect((await hentVisning(crypto.randomUUID())).status).toBe(404);
        expect((await hentVisning(versjon, 'finnes-ikke')).status).toBe(404);
    });
});

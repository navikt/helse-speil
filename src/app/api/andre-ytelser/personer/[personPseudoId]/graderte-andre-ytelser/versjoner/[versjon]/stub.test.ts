import { endreGraderteAndreYtelser, nullstillGraderteAndreYtelser } from '@app/api/andre-ytelser/andreYtelserMock';
import {
    ApiEndreGraderteAndreYtelserRequest,
    ApiGraderteAndreYtelserDag,
} from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

import { stub } from './stub';

const personPseudoId = PersonMock.findPersonPseudoId('19886497256')!;

function lagDag(overstyringer: Partial<ApiGraderteAndreYtelserDag> = {}): ApiGraderteAndreYtelserDag {
    return {
        dato: '2024-07-01',
        andreYtelserGrader: { FORELDREPENGER: 40 },
        sykdomsgrad: 30,
        arbeidsgrad: 30,
        sykdomsgradFørFordeling: 70,
        begrunnelse: 'En begrunnelse',
        ...overstyringer,
    };
}

function lagreVersjon(versjon: string | null, dager: ApiGraderteAndreYtelserDag[]): string {
    const request: ApiEndreGraderteAndreYtelserRequest = {
        yrkesaktivitet: 'ARBEIDSTAKER',
        organisasjonsnummer: '967170232',
        versjon,
        behandlingId: '94926180-4e95-4879-8975-0a63b5659831',
        dager,
    };
    const resultat = endreGraderteAndreYtelser(personPseudoId, request);
    if (resultat.type !== 'LAGRET') throw Error(`Kunne ikke lagre: ${resultat.code}`);
    return resultat.versjon;
}

function hentVersjon(versjon: string, id = personPseudoId) {
    return stub(new Request('http://localhost'), Promise.resolve({ personPseudoId: id, versjon }));
}

describe('graderte andre ytelser i en versjon-stub', () => {
    beforeEach(() => nullstillGraderteAndreYtelser());

    it('svarer med fordelingen og hendelsene til og med versjonen', async () => {
        const førsteVersjon = lagreVersjon(null, [lagDag()]);
        const andreVersjon = lagreVersjon(førsteVersjon, [
            lagDag({ andreYtelserGrader: { FORELDREPENGER: 20 }, sykdomsgrad: 50, begrunnelse: 'Endret' }),
            lagDag({ dato: '2024-07-02' }),
        ]);
        lagreVersjon(andreVersjon, [lagDag({ dato: '2024-07-03' })]);

        const response = await hentVersjon(andreVersjon);

        expect(response.status).toBe(200);
        const graderteAndreYtelser = await response.json();
        expect(graderteAndreYtelser.versjon).toBe(andreVersjon);
        expect(graderteAndreYtelser.dager).toEqual([
            lagDag({ andreYtelserGrader: { FORELDREPENGER: 20 }, sykdomsgrad: 50, begrunnelse: 'Endret' }),
            lagDag({ dato: '2024-07-02' }),
        ]);
        expect(graderteAndreYtelser.events.map((event: { versjon: string }) => event.versjon)).toEqual([
            førsteVersjon,
            andreVersjon,
        ]);
    });

    it('svarer med gjeldende fordeling for siste versjon', async () => {
        const førsteVersjon = lagreVersjon(null, [lagDag()]);
        const sisteVersjon = lagreVersjon(førsteVersjon, [lagDag({ dato: '2024-07-02' })]);

        const graderteAndreYtelser = await (await hentVersjon(sisteVersjon)).json();

        expect(graderteAndreYtelser.dager).toEqual([lagDag(), lagDag({ dato: '2024-07-02' })]);
        expect(graderteAndreYtelser.events).toHaveLength(2);
    });

    it('svarer 404 for ukjent versjon og for ukjent person', async () => {
        const versjon = lagreVersjon(null, [lagDag()]);

        expect((await hentVersjon(crypto.randomUUID())).status).toBe(404);
        expect((await hentVersjon(versjon, 'finnes-ikke')).status).toBe(404);
    });
});

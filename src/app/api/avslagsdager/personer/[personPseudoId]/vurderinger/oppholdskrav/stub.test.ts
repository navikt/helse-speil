import { NextRequest } from 'next/server';

import { stub as visningStub } from '@app/api/avslagsdager/personer/[personPseudoId]/saksbehandlerhandlinger/[handlingId]/visning/stub';
import { ApiOppholdskravvurderingRequest } from '@io/rest/generated/avslagsdager/avslagsdager.schemas';
import { ApiHandlingType } from '@io/rest/generated/spesialist.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';
import { SaksbehandlerhandlingMock } from '@spesialist-mock/storage/saksbehandlerhandling';

import { stub } from './stub';

const personPseudoId = PersonMock.findPersonPseudoId('19886497256')!;
const behandlingId = '94926180-4e95-4879-8975-0a63b5659831';

describe('oppholdskrav-stub', () => {
    beforeEach(() => SaksbehandlerhandlingMock.nullstill());

    it('lagrer vurderingen som en handling som krever totrinnsvurdering', async () => {
        const response = await post(lagRequest());

        expect(response.status).toBe(200);
        const { vurderingId } = await response.json();
        expect(SaksbehandlerhandlingMock.hentHandlinger(personPseudoId)).toContainEqual(
            expect.objectContaining({
                handlingId: vurderingId,
                handlingType: ApiHandlingType.MANUELT_VURDERT_OPPHOLDSKRAV,
                behandlingId,
                erDelAvAktivTotrinnsvurdering: true,
            }),
        );
    });

    it('lager en visning av vurderingen', async () => {
        const { vurderingId } = await (await post(lagRequest())).json();

        const visning = await visningFor(vurderingId);

        expect(visning.status).toBe(200);
        expect(await visning.json()).toEqual({
            felter: [
                { type: 'TEKST', tittel: 'Oppholdskrav', tekst: 'Ikke oppfylt' },
                { type: 'TEKST', tittel: 'EØS-borger', tekst: 'Ja' },
                { type: 'TEKST', tittel: 'Opphold i Norge, EØS eller avtaleland', tekst: 'Nei' },
                { type: 'TEKST', tittel: 'Unntak i andre ledd', tekst: 'Nei' },
                { type: 'TEKST', tittel: 'Godkjent opphold utenfor Norge i inntil fire uker', tekst: 'Nei' },
                { type: 'LISTE', tittel: 'Dager', elementer: ['15.07.2024–16.07.2024', '22.07.2024'] },
                { type: 'LISTE', tittel: 'Journalposter', elementer: ['123'] },
                { type: 'TEKST', tittel: 'Begrunnelse', tekst: 'Opphold utenfor EØS' },
            ],
        });
    });

    it('viser ikke journalposter når ingen er oppgitt', async () => {
        const { vurderingId } = await (await post(lagRequest({ journalpostId: [] }))).json();

        const { felter } = await (await visningFor(vurderingId)).json();

        expect(felter.map(({ tittel }: { tittel: string }) => tittel)).not.toContain('Journalposter');
    });

    it('viser bare spørsmålene som ble stilt når første ledd er oppfylt', async () => {
        const request = lagRequest({ oppholdIGodkjentOmråde: true, journalpostId: [] });
        const { vurderingId } = await (await post(request)).json();

        const { felter } = await (await visningFor(vurderingId)).json();

        expect(felter.slice(0, 3)).toEqual([
            { type: 'TEKST', tittel: 'Oppholdskrav', tekst: 'Oppfylt' },
            { type: 'TEKST', tittel: 'EØS-borger', tekst: 'Ja' },
            { type: 'TEKST', tittel: 'Opphold i Norge, EØS eller avtaleland', tekst: 'Ja' },
        ]);
        expect(felter[3]).toMatchObject({ tittel: 'Dager' });
    });

    it('viser unntaket i andre ledd for en som ikke er EØS-borger', async () => {
        const request = lagRequest({ eøsBorger: false, unntakAndreLedd: 'INNLAGT_I_HELSEINSTITUSJON' });
        const { vurderingId } = await (await post(request)).json();

        const { felter } = await (await visningFor(vurderingId)).json();

        expect(felter.slice(0, 4)).toEqual([
            { type: 'TEKST', tittel: 'Oppholdskrav', tekst: 'Oppfylt' },
            { type: 'TEKST', tittel: 'EØS-borger', tekst: 'Nei' },
            { type: 'TEKST', tittel: 'Opphold i Norge', tekst: 'Nei' },
            { type: 'TEKST', tittel: 'Unntak i andre ledd', tekst: 'Innlagt i helseinstitusjon' },
        ]);
        expect(felter[4]).toMatchObject({ tittel: 'Dager' });
    });

    it.each([
        [{ dager: [] }, 'Dager må oppgis'],
        [{ fritekstbegrunnelse: '' }, 'Fritekstbegrunnelse må oppgis'],
        [{ unntakAndreLedd: null }, 'Må svare på om et av unntakene i andre ledd gjelder'],
        [{ godkjentOppholdInntilFireUker: null }, 'Må svare på om oppholdet er godkjent for inntil fire uker'],
    ])('svarer 400 med samme tittel som sp-avslagsdager for %o', async (overstyringer, tittel) => {
        const antallHandlingerFør = SaksbehandlerhandlingMock.hentHandlinger(personPseudoId).length;

        const response = await post(lagRequest(overstyringer));

        expect(response.status).toBe(400);
        expect(await response.json()).toMatchObject({ status: 400, title: tittel });
        expect(SaksbehandlerhandlingMock.hentHandlinger(personPseudoId)).toHaveLength(antallHandlingerFør);
    });

    it('svarer 404 for ukjent person', async () => {
        const response = await post(lagRequest(), 'ukjent');

        expect(response.status).toBe(404);
    });
});

function lagRequest(overstyringer: Partial<ApiOppholdskravvurderingRequest> = {}): ApiOppholdskravvurderingRequest {
    return {
        behandlingId,
        dager: ['2024-07-16', '2024-07-15', '2024-07-22'],
        eøsBorger: true,
        oppholdIGodkjentOmråde: false,
        unntakAndreLedd: 'INGEN',
        godkjentOppholdInntilFireUker: false,
        fritekstbegrunnelse: 'Opphold utenfor EØS',
        journalpostId: ['123'],
        ...overstyringer,
    };
}

function post(body: ApiOppholdskravvurderingRequest, id = personPseudoId) {
    return stub(
        new Request('http://localhost/api/avslagsdager', { method: 'POST', body: JSON.stringify(body) }),
        Promise.resolve({ personPseudoId: id }),
    );
}

function visningFor(handlingId: string) {
    return visningStub(new NextRequest('http://localhost'), Promise.resolve({ personPseudoId, handlingId }));
}

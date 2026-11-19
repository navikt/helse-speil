import { vurderMedlemskap } from '@app/api/medlemskap/personer/[personPseudoId]/vilkarsvurderinger/medlemskapMock';
import { ApiMedlemskapsstatus } from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

import { stub } from './stub';

const personPseudoId = PersonMock.findPersonPseudoId('19886497256')!;

function hentVisning(handlingId: string, id = personPseudoId) {
    return stub(new Request('http://localhost'), Promise.resolve({ personPseudoId: id, handlingId }));
}

describe('visning av saksbehandlerhandling-stub for medlemskap', () => {
    it('viser status, journalposter og begrunnelse for en manuell vurdering', async () => {
        const id = vurderMedlemskap(personPseudoId, {
            skjæringstidspunkt: '2024-07-01',
            status: ApiMedlemskapsstatus.NEI,
            fritekstbegrunnelse: 'Bor utenfor EØS',
            journalpostId: ['453912345'],
        });

        const response = await hentVisning(id);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            felter: [
                { type: 'TEKST', tittel: 'Medlemskap', tekst: 'Ikke oppfylt' },
                { type: 'LISTE', tittel: 'Journalposter', elementer: ['453912345'] },
                { type: 'TEKST', tittel: 'Begrunnelse', tekst: 'Bor utenfor EØS' },
            ],
        });
    });

    it('utelater journalposter når det ikke er noen', async () => {
        const id = vurderMedlemskap(personPseudoId, {
            skjæringstidspunkt: '2024-07-01',
            status: ApiMedlemskapsstatus.JA,
            fritekstbegrunnelse: 'Medlem',
            journalpostId: [],
        });

        const { felter } = await (await hentVisning(id)).json();

        expect(felter).toEqual([
            { type: 'TEKST', tittel: 'Medlemskap', tekst: 'Oppfylt' },
            { type: 'TEKST', tittel: 'Begrunnelse', tekst: 'Medlem' },
        ]);
    });

    it('svarer 404 for ukjent handling og for ukjent person', async () => {
        const id = vurderMedlemskap(personPseudoId, {
            skjæringstidspunkt: '2024-07-01',
            status: ApiMedlemskapsstatus.JA,
            fritekstbegrunnelse: 'Medlem',
            journalpostId: [],
        });

        expect((await hentVisning(crypto.randomUUID())).status).toBe(404);
        expect((await hentVisning(id, 'finnes-ikke')).status).toBe(404);
    });
});

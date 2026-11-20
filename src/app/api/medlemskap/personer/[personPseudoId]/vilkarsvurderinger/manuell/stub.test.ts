import { NextRequest } from 'next/server';

import { hentMedlemskapsvurdering } from '@app/api/medlemskap/personer/[personPseudoId]/vilkarsvurderinger/medlemskapMock';
import {
    ApiManuellMedlemskapsstatus,
    ApiManuellVilkårsvurderingRequest,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

import { stub } from './stub';

vi.mock('@spesialist-mock/saksbehandling', () => ({
    registrerManuellMedlemskapsvurdering: vi.fn(),
    pushEventEtterForsinkelse: vi.fn(),
}));

const personPseudoId = PersonMock.findPersonPseudoId('19886497256')!;
const automatiskVurderingId = '6ddd9fd0-4aad-5029-b073-ff75dbc6ac80';

describe('stub for manuell medlemskapsvurdering', () => {
    it('svarer 409 når saksbehandler så på en vurdering som ikke lenger er gjeldende', async () => {
        hentMedlemskapsvurdering(personPseudoId, automatiskVurderingId);

        const første = await vurder(automatiskVurderingId);
        const andre = await vurder(automatiskVurderingId);

        expect(første.status).toBe(200);
        expect(andre.status).toBe(409);
        expect((await vurder((await første.json()).medlemskapsvurderingId)).status).toBe(200);
    });
});

function vurder(gjeldendeMedlemskapsvurderingId: string) {
    const body: ApiManuellVilkårsvurderingRequest = {
        skjæringstidspunkt: '2024-07-01',
        gjeldendeMedlemskapsvurderingId,
        status: ApiManuellMedlemskapsstatus.JA,
        fritekstbegrunnelse: 'Medlem',
        journalpostId: [],
    };
    return stub(
        new NextRequest('http://localhost', { method: 'POST', body: JSON.stringify(body) }),
        Promise.resolve({ personPseudoId }),
    );
}

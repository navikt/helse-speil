import { NextRequest } from 'next/server';

import { ApiSykepengegrunnlagListe } from '@io/rest/generated/sykepengegrunnlag/sykepengegrunnlag.schemas';

import { stub } from './stub';

function hent(query: string) {
    return stub(
        new NextRequest(`http://localhost/api/sykepengegrunnlag/personer/en-person/sykepengegrunnlag${query}`),
        Promise.resolve({ personPseudoId: 'en-person' }),
    );
}

describe('sykepengegrunnlag-stub', () => {
    it('gir et grunnlag for skjæringstidspunktet det spørres om', async () => {
        const response = await hent('?skjaeringstidspunkt=2026-03-01');

        const body: ApiSykepengegrunnlagListe = await response.json();
        expect(body.sykepengegrunnlag.map((it) => it.skjæringstidspunkt)).toEqual(['2026-03-01']);
    });

    it('svarer 400 uten skjæringstidspunkt', async () => {
        expect((await hent('')).status).toBe(400);
    });
});

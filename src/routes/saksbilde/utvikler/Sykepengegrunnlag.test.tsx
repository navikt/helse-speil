import { render, screen } from '@test-utils';

import { fetchMock, jsonResponse } from '../../../../vitest.setup';
import { Sykepengegrunnlag } from './Sykepengegrunnlag';

const personPseudoId = 'en-person-pseudo-id';
const sykepengegrunnlagId = '2b0a6f4e-8f0e-4f7a-9f1d-6d1f3b2c4a51';

describe('Sykepengegrunnlag', () => {
    it('henter grunnlagene for skjæringstidspunktet og viser dem som JSON', async () => {
        fetchMock.mockImplementation(() =>
            Promise.resolve(
                jsonResponse({ sykepengegrunnlag: [{ id: sykepengegrunnlagId, opphav: 'VILKARSPROVING' }] }),
            ),
        );

        render(<Sykepengegrunnlag personPseudoId={personPseudoId} skjæringstidspunkt="2026-01-01" />);

        expect(await screen.findByText(`"${sykepengegrunnlagId}"`)).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledWith(
            `/api/sykepengegrunnlag/personer/${personPseudoId}/sykepengegrunnlag?skjaeringstidspunkt=2026-01-01`,
            expect.anything(),
        );
    });

    it('sier fra når skjæringstidspunktet ikke har noe grunnlag', async () => {
        fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({ sykepengegrunnlag: [] })));

        render(<Sykepengegrunnlag personPseudoId={personPseudoId} skjæringstidspunkt="2026-01-01" />);

        expect(await screen.findByText('Fant ikke noe sykepengegrunnlag for skjæringstidspunktet')).toBeInTheDocument();
    });

    it('viser en feilmelding når grunnlagene ikke kan hentes', async () => {
        fetchMock.mockImplementation(() =>
            Promise.resolve(jsonResponse({ title: 'Mangler tilgang', status: 403 }, 403)),
        );

        render(<Sykepengegrunnlag personPseudoId={personPseudoId} skjæringstidspunkt="2026-01-01" />);

        expect(await screen.findByText(/Kunne ikke hente sykepengegrunnlag/)).toBeInTheDocument();
    });
});

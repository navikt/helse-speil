import { Rettighetskategori as Avgjørelse } from '@io/rest/rettighetskategori';
import { render, screen, waitFor } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { fetchMock, jsonBody, jsonResponse } from '../../../../vitest.setup';
import { Rettighetskategori } from './Rettighetskategori';

const personPseudoId = 'en-person-pseudo-id';
const rettighetskategoriId = '60a28c62-49b6-4c76-8236-26f922edfd6c';
const avgjørelse: Avgjørelse = {
    id: rettighetskategoriId,
    skjæringstidspunkt: '2026-01-01',
    hovedkategori: 'SELVSTENDIG_NAERINGSDRIVENDE',
    tilleggskategorier: ['JORDBRUKER'],
    kilde: 'AUTOMATISK',
    vurderingstidspunkt: '2026-02-01T10:00:00Z',
};

const miljø = vi.hoisted(() => ({ erUtvikling: true }));
vi.mock('@/env', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/env')>()),
    get erUtvikling() {
        return miljø.erUtvikling;
    },
}));

describe('Rettighetskategori', () => {
    beforeEach(() => {
        miljø.erUtvikling = true;
        mockRettighetskategoriApi();
    });

    it('forhåndsutfyller Jordbruker fra avgjørelsen', async () => {
        render(<Rettighetskategori personPseudoId={personPseudoId} rettighetskategoriId={rettighetskategoriId} />);

        expect(await screen.findByRole('checkbox', { name: 'Jordbruker' })).toBeChecked();
    });

    it('deaktiverer Jordbruker for arbeidstakere', async () => {
        mockRettighetskategoriApi({
            gjeldende: { ...avgjørelse, hovedkategori: 'ARBEIDSTAKER', tilleggskategorier: [] },
        });
        render(<Rettighetskategori personPseudoId={personPseudoId} rettighetskategoriId={rettighetskategoriId} />);

        expect(await screen.findByRole('checkbox', { name: 'Jordbruker' })).toBeDisabled();
    });

    it('fjerner Jordbruker uten begrunnelse og viser kvittering med den nye ID-en', async () => {
        const nyId = '4d879c99-a646-45a4-8b3a-c2384d7ba6cf';
        mockRettighetskategoriApi({
            lagret: { ...avgjørelse, id: nyId, tilleggskategorier: [], kilde: 'SAKSBEHANDLER' },
        });
        render(<Rettighetskategori personPseudoId={personPseudoId} rettighetskategoriId={rettighetskategoriId} />);

        await userEvent.click(await screen.findByRole('checkbox', { name: 'Jordbruker' }));
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Vurderingen er lagret')).toBeInTheDocument();
        expect(screen.getByText(`Rettighetskategori-ID: ${nyId}`)).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledWith(
            `/api/rettighetskategori/personer/${personPseudoId}/rettighetskategorier/${rettighetskategoriId}/manuell-vurdering`,
            expect.objectContaining({
                method: 'POST',
                body: jsonBody({ tilleggskategorier: [], begrunnelse: null }),
            }),
        );
    });

    it('ber saksbehandler laste siden på nytt når avgjørelsen er endret', async () => {
        mockRettighetskategoriApi({
            lagret: { title: 'Rettighetskategorien er endret', status: 409 },
            lagringsstatus: 409,
        });
        render(<Rettighetskategori personPseudoId={personPseudoId} rettighetskategoriId={rettighetskategoriId} />);

        await userEvent.click(await screen.findByRole('checkbox', { name: 'Jordbruker' }));
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(
            await screen.findByText('Rettighetskategorien er endret. Last siden på nytt før du vurderer den manuelt.'),
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Lagre' })).toBeDisabled();
        expect(screen.queryByText('Vurderingen er lagret')).not.toBeInTheDocument();
    });

    it('viser en generell feilmelding ved andre feil og lar saksbehandler prøve igjen', async () => {
        mockRettighetskategoriApi({ lagret: { title: 'En intern feil', status: 500 }, lagringsstatus: 500 });
        render(<Rettighetskategori personPseudoId={personPseudoId} rettighetskategoriId={rettighetskategoriId} />);

        await userEvent.click(await screen.findByRole('checkbox', { name: 'Jordbruker' }));
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Vurderingen er ikke lagret. Prøv igjen senere.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Lagre' })).toBeEnabled();
        expect(screen.queryByText('Vurderingen er lagret')).not.toBeInTheDocument();

        mockRettighetskategoriApi({ lagret: { ...avgjørelse, tilleggskategorier: [], kilde: 'SAKSBEHANDLER' } });
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Vurderingen er lagret')).toBeInTheDocument();
        expect(screen.queryByText('Vurderingen er ikke lagret. Prøv igjen senere.')).not.toBeInTheDocument();
    });

    it('legger til Jordbruker med begrunnelse for arbeidstaker og selvstendig næringsdrivende', async () => {
        mockRettighetskategoriApi({
            gjeldende: {
                ...avgjørelse,
                hovedkategori: 'ARBEIDSTAKER_OG_SELVSTENDIG_NAERINGSDRIVENDE',
                tilleggskategorier: [],
            },
            lagret: {
                ...avgjørelse,
                hovedkategori: 'ARBEIDSTAKER_OG_SELVSTENDIG_NAERINGSDRIVENDE',
                kilde: 'SAKSBEHANDLER',
            },
        });
        render(<Rettighetskategori personPseudoId={personPseudoId} rettighetskategoriId={rettighetskategoriId} />);

        const checkbox = await screen.findByRole('checkbox', { name: 'Jordbruker' });
        expect(checkbox).not.toBeChecked();
        await userEvent.click(checkbox);
        await userEvent.type(screen.getByLabelText('Begrunnelse (valgfritt)'), 'Driver gård');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Vurderingen er lagret')).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledWith(
            `/api/rettighetskategori/personer/${personPseudoId}/rettighetskategorier/${rettighetskategoriId}/manuell-vurdering`,
            expect.objectContaining({
                method: 'POST',
                body: jsonBody({ tilleggskategorier: ['JORDBRUKER'], begrunnelse: 'Driver gård' }),
            }),
        );
    });

    it('lar saksbehandler uten skrivetilgang fylle ut skjemaet, men ikke lagre', async () => {
        mockRettighetskategoriApi({ tilganger: ['LES'] });
        render(<Rettighetskategori personPseudoId={personPseudoId} rettighetskategoriId={rettighetskategoriId} />);

        await userEvent.click(await screen.findByRole('checkbox', { name: 'Jordbruker' }));
        await userEvent.type(screen.getByLabelText('Begrunnelse (valgfritt)'), 'Driver ikke gård');
        const lagre = screen.getByRole('button', { name: 'Lagre' });
        expect(lagre).toHaveAttribute('aria-disabled', 'true');
        await userEvent.click(lagre);
        await userEvent.keyboard('{Enter}');

        expect(fetchMock.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(0);
    });

    it('viser avgjørelsen, men ikke skjemaet i prod', async () => {
        miljø.erUtvikling = false;
        render(<Rettighetskategori personPseudoId={personPseudoId} rettighetskategoriId={rettighetskategoriId} />);

        expect(await screen.findByText(`"${rettighetskategoriId}"`)).toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: 'Jordbruker' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Lagre' })).not.toBeInTheDocument();
    });

    it('viser ikke skjemaet når vedtaksperioden mangler rettighetskategori', () => {
        render(<Rettighetskategori personPseudoId={personPseudoId} />);

        expect(screen.getByText('Vedtaksperioden har ikke vilkårsgrunnlag med rettighetskategori')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Lagre' })).not.toBeInTheDocument();
    });

    it('viser ikke skjemaet når avgjørelsen ikke kan hentes', async () => {
        fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({}, 500)));
        render(<Rettighetskategori personPseudoId={personPseudoId} rettighetskategoriId={rettighetskategoriId} />);

        expect(await screen.findByText(/Kunne ikke hente rettighetskategori/)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Lagre' })).not.toBeInTheDocument();
    });

    it('forhåndsutfyller skjemaet på nytt ved bytte av avgjørelse', async () => {
        const annenId = 'ff1f52e2-38aa-429e-a179-09fd73fa6b28';
        fetchMock.mockImplementation((input) =>
            Promise.resolve(
                jsonResponse(
                    String(input) === '/api/spesialist/bruker'
                        ? { tilganger: ['SKRIV'] }
                        : String(input).endsWith(annenId)
                          ? { ...avgjørelse, id: annenId, tilleggskategorier: [] }
                          : avgjørelse,
                ),
            ),
        );
        const { rerender } = render(
            <Rettighetskategori personPseudoId={personPseudoId} rettighetskategoriId={rettighetskategoriId} />,
        );
        expect(await screen.findByRole('checkbox', { name: 'Jordbruker' })).toBeChecked();
        await userEvent.type(screen.getByLabelText('Begrunnelse (valgfritt)'), 'Begrunnelse for første avgjørelse');

        rerender(<Rettighetskategori personPseudoId={personPseudoId} rettighetskategoriId={annenId} />);

        await waitFor(() => expect(screen.getByRole('checkbox', { name: 'Jordbruker' })).not.toBeChecked());
        expect(screen.getByLabelText('Begrunnelse (valgfritt)')).toHaveValue('');
    });
});

function mockRettighetskategoriApi({
    gjeldende = avgjørelse,
    lagret = gjeldende,
    lagringsstatus = 200,
    tilganger = ['SKRIV'],
}: {
    gjeldende?: Avgjørelse;
    lagret?: unknown;
    lagringsstatus?: number;
    tilganger?: string[];
} = {}) {
    fetchMock.mockImplementation((input, init) => {
        if (String(input) === '/api/spesialist/bruker') return Promise.resolve(jsonResponse({ tilganger }));
        if (init?.method === 'POST') return Promise.resolve(jsonResponse(lagret, lagringsstatus));
        return Promise.resolve(jsonResponse(gjeldende));
    });
}

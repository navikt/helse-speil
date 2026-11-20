import { Mock } from 'vitest';

import { ApiManuellMedlemskapsstatus } from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { usePostManuellVilkårsvurderingBehandler } from '@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { MedlemskapsvurderingSkjema } from './MedlemskapsvurderingSkjema';

vi.mock('@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger')>()),
    usePostManuellVilkårsvurderingBehandler: vi.fn(),
}));

vi.mock('@hooks/brukerrolleHooks', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hooks/brukerrolleHooks')>()),
    useHarSkrivetilgang: () => true,
}));

const mutate = vi.fn();

function mockMutation(error: { status: number } | null = null) {
    (usePostManuellVilkårsvurderingBehandler as Mock).mockReturnValue({
        mutate,
        isPending: false,
        isError: error !== null,
        error,
    });
}

beforeEach(() => {
    mutate.mockClear();
    mockMutation();
});

describe('MedlemskapsvurderingSkjema', () => {
    it('sender med id-en til vurderingen saksbehandler så på', async () => {
        renderSkjema();

        await userEvent.click(screen.getByRole('radio', { name: 'Ja' }));
        await userEvent.click(screen.getByRole('radio', { name: 'Saken er godt nok opplyst i Speil' }));
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Medlem');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalledWith({
            personId: 'person-1',
            data: {
                skjæringstidspunkt: '2024-01-01',
                gjeldendeMedlemskapsvurderingId: 'vurdering-1',
                status: ApiManuellMedlemskapsstatus.JA,
                fritekstbegrunnelse: 'Medlem',
                journalpostId: [],
            },
        });
    });

    it('ber saksbehandler laste inn siden på nytt når vurderingen er endret', () => {
        mockMutation({ status: 409 });

        renderSkjema();

        expect(screen.getByText(/Medlemskapsvurderingen er endret siden du åpnet saken/)).toBeVisible();
    });

    it('viser generell feilmelding ved andre feil', () => {
        mockMutation({ status: 500 });

        renderSkjema();

        expect(screen.getByText('Kunne ikke lagre vurderingen')).toBeVisible();
    });
});

function renderSkjema() {
    render(
        <MedlemskapsvurderingSkjema
            personPseudoId="person-1"
            skjæringstidspunkt="2024-01-01"
            gjeldendeMedlemskapsvurderingId="vurdering-1"
            onOverstyrt={vi.fn()}
            onLukk={vi.fn()}
        />,
    );
}

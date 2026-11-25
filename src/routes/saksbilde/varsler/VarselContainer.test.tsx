import { Mock } from 'vitest';

import { axe } from '@/test/axe';
import { UTEN_SKRIVETILGANG_TEKST } from '@components/skrivetilgang/utenSkrivetilgang';
import { useHarSkrivetilgang } from '@hooks/brukerrolleHooks';
import { ApiSaksbildeVarselstatus, ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { render, screen, waitFor, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { fetchMock, jsonResponse } from '../../../../vitest.setup';
import { VarselContainer } from './VarselContainer';
import { useSkalViseMedlemskapsvarselSomFeil } from './useSkalViseMedlemskapsvarselSomFeil';

vi.mock('@hooks/brukerrolleHooks', () => ({ useHarSkrivetilgang: vi.fn() }));
vi.mock('@state/person', () => ({ useOppdaterPersonICache: () => vi.fn(), mapPerioder: vi.fn() }));
vi.mock('./useSkalViseAvviksvarselSomFeil', () => ({ useSkalViseAvviksvarselSomFeil: () => false }));
vi.mock('@saksbilde/varsler/useSkalViseUnder20Sykdomsgradsvarsel', () => ({
    useSkalViseUnder20SykdomsgradsvarselSomFeil: () => false,
}));
vi.mock('./useSkalViseMedlemskapsvarselSomFeil', () => ({ useSkalViseMedlemskapsvarselSomFeil: vi.fn() }));

describe('VarselContainer', () => {
    beforeEach(() => {
        (useHarSkrivetilgang as Mock).mockReturnValue(true);
        (useSkalViseMedlemskapsvarselSomFeil as Mock).mockReturnValue({ skalViseSomFeil: false, henterStatus: false });
    });

    it('er åpen fra start og viser antall varsler og oppsummeringen', () => {
        render(<VarselContainer varsler={[aktivt, vurdert, godkjent]} />);

        const kort = screen.getByRole('region', { name: 'Varsler' });
        expect(kort).toHaveTextContent('Varsler (3)');
        expect(kort).toHaveTextContent('1 må vurderes · 2 vurdert');
        expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Aktivt varsel' })).toBeVisible();
    });

    it('kan lukkes og åpnes igjen', async () => {
        render(<VarselContainer varsler={[aktivt]} />);

        const kortknapp = screen.getByRole('button', { expanded: true });
        await userEvent.click(kortknapp);

        expect(kortknapp).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByRole('button', { name: 'Aktivt varsel' })).not.toBeInTheDocument();

        await userEvent.click(kortknapp);

        expect(kortknapp).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('button', { name: 'Aktivt varsel' })).toBeVisible();
    });

    it.each([
        ['rød', 'danger', () => [aktivt, medlemskapsvarsel]],
        ['gul', 'warning', () => [aktivt, vurdert]],
        ['grønn', 'success', () => [vurdert, godkjent]],
    ])('er %s etter det mest alvorlige varselet', (_, farge, varsler) => {
        (useSkalViseMedlemskapsvarselSomFeil as Mock).mockReturnValue({ skalViseSomFeil: true, henterStatus: false });

        render(<VarselContainer varsler={varsler()} />);

        expect(screen.getByRole('region', { name: 'Varsler' })).toHaveAttribute('data-color', farge);
    });

    it('viser hvert varsel med tittel i en liste når det er flere varsler', () => {
        render(<VarselContainer varsler={[aktivt, vurdert, godkjent]} />);

        expect(screen.getByRole('button', { name: 'Aktivt varsel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Vurdert varsel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Godkjent varsel' })).toBeInTheDocument();
        expect(screen.queryByText('Må vurderes')).not.toBeInTheDocument();
        expect(screen.queryByText('Vurdert', { selector: '.aksel-tag' })).not.toBeInTheDocument();
    });

    it.each([
        ['ett varsel', () => [aktivt]],
        ['flere varsler', () => [aktivt, vurdert, godkjent]],
    ])('viser hvert varsel som et lukket punkt med avkrysningen synlig, med %s', async (_, varsler) => {
        render(<VarselContainer varsler={varsler()} />);

        const varselknapp = screen.getByRole('button', { name: 'Aktivt varsel' });
        expect(varselknapp).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getAllByRole('checkbox', { name: /Vurdert/ })).toHaveLength(varsler().length);
        expect(screen.getAllByText('En forklaring')[0]!.closest('[aria-hidden="true"]')).not.toBeNull();

        await userEvent.click(varselknapp);

        expect(varselknapp).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getAllByText('En forklaring')[0]!.closest('[aria-hidden="true"]')).toBeNull();
    });

    it('viser forklaring, handling og når varselet ble opprettet', async () => {
        render(<VarselContainer varsler={[aktivt]} />);
        await åpneVarselet();

        expect(screen.getByText('En forklaring')).toBeVisible();
        expect(screen.getByText('En handling')).toBeVisible();
        expect(screen.getByText('Opprettet: 01.01.2020 kl. 12.00')).toBeVisible();
    });

    it('viser varsel uten forklaring og handling som et punkt som ikke kan åpnes', () => {
        render(<VarselContainer varsler={[utenInnhold, aktivt]} />);

        const kort = screen.getByRole('region', { name: 'Varsler' });
        expect(within(kort).getByRole('heading', { level: 3, name: 'Varsel uten innhold' })).toBeVisible();
        expect(within(kort).queryByRole('button', { name: /Varsel uten innhold/ })).not.toBeInTheDocument();
        expect(within(kort).getAllByRole('button', { expanded: false })).toHaveLength(1);
        expect(within(kort).getAllByRole('checkbox', { name: /Vurdert/ })).toHaveLength(2);
        expect(screen.getByRole('heading', { name: 'Varsel uten innhold' }).closest('[data-status]')).toHaveAttribute(
            'data-status',
            'aktiv',
        );
    });

    it('rendrer varsel som ikke kan åpnes uten violations', async () => {
        const { container } = render(<VarselContainer varsler={[utenInnhold]} />);

        expect((await axe(container)).violations).toEqual([]);
    });

    it('har nøytral bakgrunn i innholdet og fargen til hvert varsel på varselet', () => {
        (useSkalViseMedlemskapsvarselSomFeil as Mock).mockReturnValue({ skalViseSomFeil: true, henterStatus: false });
        render(<VarselContainer varsler={[aktivt, vurdert, medlemskapsvarsel]} />);

        const kort = screen.getByRole('region', { name: 'Varsler' });
        expect(kort).toHaveAttribute('data-color', 'danger');
        expect(kort.querySelector('.aksel-expansioncard__content')).toHaveClass('bg-ax-bg-raised');
        expect(varselrad('Aktivt varsel')).toHaveAttribute(
            'style',
            expect.stringContaining('var(--ax-bg-warning-soft)'),
        );
        expect(varselrad('Vurdert varsel')).toHaveAttribute(
            'style',
            expect.stringContaining('var(--ax-bg-success-soft)'),
        );
        expect(varselrad('Aktivt varsel')).toHaveAttribute('style', expect.stringContaining('var(--ax-radius-8)'));
        expect(varselrad('Vurder lovvalg og medlemskap')).toHaveAttribute(
            'style',
            expect.stringContaining('var(--ax-bg-danger-soft)'),
        );
    });

    it('viser ingen status i toppen av kortet mens medlemskapsstatusen hentes', () => {
        (useSkalViseMedlemskapsvarselSomFeil as Mock).mockReturnValue({ skalViseSomFeil: false, henterStatus: true });
        const feil = vi.spyOn(console, 'error');
        render(<VarselContainer varsler={[aktivt, medlemskapsvarsel]} />);

        expect(feil.mock.calls.map((kall) => kall.join(' '))).not.toContainEqual(
            expect.stringMatching(/cannot be a descendant of/),
        );
        const kort = screen.getByRole('region', { name: 'Varsler' });
        expect(kort).toHaveTextContent('Varsler (2)');
        expect(kort).not.toHaveTextContent('må vurderes');
        expect(kort).toHaveAttribute('data-color', 'neutral');
    });

    it('viser skjeletter i stedet for varslene mens medlemskapsstatusen hentes', () => {
        (useSkalViseMedlemskapsvarselSomFeil as Mock).mockReturnValue({ skalViseSomFeil: false, henterStatus: true });
        render(<VarselContainer varsler={[aktivt, medlemskapsvarsel]} />);

        expect(screen.queryByRole('button', { name: /Vurder lovvalg og medlemskap/ })).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it.each([
        ['ett varsel', () => [aktivt]],
        ['flere varsler', () => [aktivt, vurdert, godkjent]],
    ])('har ingen tilgjengelighetsfeil med %s', async (_, varsler) => {
        const { container } = render(<VarselContainer varsler={varsler()} />);
        for (const knapp of screen.queryAllByRole('button', { expanded: false })) await userEvent.click(knapp);

        expect((await axe(container)).violations).toEqual([]);
    });

    describe('vurdering', () => {
        it('lagrer vurderingen når saksbehandler krysser av', async () => {
            fetchMock
                .mockResolvedValueOnce(jsonResponse(undefined, 204))
                .mockResolvedValueOnce(jsonResponse({ ...aktivt, status: 'VURDERT', vurdering: null }));
            render(<VarselContainer varsler={[aktivt]} />);
            await åpneVarselet();

            const vurdert = screen.getByRole('checkbox', { name: /Vurdert/ });
            expect(vurdert).not.toBeChecked();
            await userEvent.click(vurdert);

            await waitFor(() =>
                expect(sendteKall()).toContainEqual(['PUT', `/api/spesialist/varsler/${aktivt.id}/vurdering`]),
            );
        });

        it('fjerner vurderingen når saksbehandler fjerner krysset', async () => {
            fetchMock.mockResolvedValueOnce(jsonResponse(undefined, 204)).mockResolvedValueOnce(jsonResponse(vurdert));
            render(<VarselContainer varsler={[vurdert]} />);
            await åpneVarselet();

            const avkrysning = screen.getByRole('checkbox', { name: /Vurdert/ });
            expect(avkrysning).toBeChecked();
            expect(screen.getByText(/^Vurdert: 02\.01\.2020/)).toHaveTextContent(/av A123456$/);
            await userEvent.click(avkrysning);

            await waitFor(() =>
                expect(sendteKall()).toContainEqual(['DELETE', `/api/spesialist/varsler/${vurdert.id}/vurdering`]),
            );
        });

        it('har ingen avkrysning for varsler som må løses', async () => {
            (useSkalViseMedlemskapsvarselSomFeil as Mock).mockReturnValue({
                skalViseSomFeil: true,
                henterStatus: false,
            });
            render(<VarselContainer varsler={[medlemskapsvarsel]} />);
            await åpneVarselet();

            expect(screen.getByRole('button', { name: 'Vurder lovvalg og medlemskap' })).toBeVisible();
            expect(screen.queryByText('Må løses', { exact: true })).not.toBeInTheDocument();
            expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
        });

        it('viser godkjente varsler som vurdert uten at vurderingen kan endres', async () => {
            render(<VarselContainer varsler={[godkjent]} />);
            await åpneVarselet();

            const avkrysning = screen.getByRole('checkbox', { name: /Vurdert/ });
            expect(avkrysning).toBeChecked();
            expect(screen.getByTitle(/skrivebeskyttet/i)).toBeInTheDocument();
            await userEvent.click(avkrysning);

            expect(fetchMock).not.toHaveBeenCalled();
        });

        it('kan ikke endres uten skrivetilgang', async () => {
            (useHarSkrivetilgang as Mock).mockReturnValue(false);
            render(<VarselContainer varsler={[aktivt]} />);
            await åpneVarselet();

            const avkrysning = screen.getByRole('checkbox', { name: /Vurdert/ });
            expect(avkrysning).toHaveAttribute('aria-disabled', 'true');
            await userEvent.click(avkrysning);

            expect(avkrysning).not.toBeChecked();
            expect(fetchMock).not.toHaveBeenCalled();
            await userEvent.hover(avkrysning);
            expect(await screen.findByText(UTEN_SKRIVETILGANG_TEKST)).toBeInTheDocument();
        });

        it.each([
            [404, 'Varselet finnes ikke lenger. Oppdater siden (F5).'],
            [409, 'Varselet har allerede endret status. Oppdater siden (F5).'],
            [500, 'Det har skjedd en feil. Prøv igjen senere eller kontakt en utvikler. (Feilkode: 500)'],
        ])('viser feilmelding når lagringen feiler med %i', async (status, melding) => {
            fetchMock.mockResolvedValueOnce(jsonResponse({}, status));
            render(<VarselContainer varsler={[aktivt]} />);
            await åpneVarselet();

            await userEvent.click(screen.getByRole('checkbox', { name: /Vurdert/ }));

            expect(await screen.findByText(melding)).toBeVisible();
        });
    });
});

function sendteKall() {
    return fetchMock.mock.calls.map(([url, init]) => [init?.method ?? 'GET', String(url)]);
}

function varselrad(navn: string) {
    return screen.getByRole('button', { name: navn }).closest('[data-status]');
}

async function åpneVarselet() {
    const kort = screen.getByRole('region', { name: 'Varsler' });
    await userEvent.click(within(kort).getByRole('button', { expanded: false }));
}

const varsel: ApiVarselDTO = {
    id: '61b4e00e-497b-4454-ba9b-c59cda9a462f',
    definisjonId: 'EN_ID',
    behandlingId: 'EN_ID',
    opprettet: '2020-01-01T12:00:00',
    kode: 'RV_IM_1',
    tittel: 'Aktivt varsel',
    forklaring: 'En forklaring',
    handling: 'En handling',
    vurdering: null,
};

const aktivt = varsel;

const vurdert: ApiVarselDTO = {
    ...varsel,
    id: 'fcce7e53-6a16-4d16-a770-9f4400c62167',
    kode: 'RV_IM_2',
    tittel: 'Vurdert varsel',
    vurdering: { ident: 'A123456', status: ApiSaksbildeVarselstatus.VURDERT, tidsstempel: '2020-01-02T10:00:00' },
};

const godkjent: ApiVarselDTO = {
    ...varsel,
    id: '2ef79f41-5be9-4303-9f97-61490a4b12ee',
    kode: 'RV_IM_3',
    tittel: 'Godkjent varsel',
    vurdering: { ident: 'B654321', status: ApiSaksbildeVarselstatus.GODKJENT, tidsstempel: '2020-01-03T10:00:00' },
};

const medlemskapsvarsel: ApiVarselDTO = {
    ...varsel,
    id: 'a1b2c3d4-0000-4000-8000-000000000001',
    kode: 'RV_MV_1',
    tittel: 'Vurder lovvalg og medlemskap',
};

const utenInnhold: ApiVarselDTO = {
    ...varsel,
    id: 'a1b2c3d4-0000-4000-8000-000000000002',
    kode: 'RV_VV_2',
    tittel: 'Varsel uten innhold',
    forklaring: null,
    handling: null,
};

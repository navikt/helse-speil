import mockRouter from 'next-router-mock';
import { Mock } from 'vitest';

import { SaksbildeSide } from '@saksbilde/SaksbildeSide';
import { useFetchPersonQuery } from '@state/person';
import { useRisikovurdering } from '@state/risikovurdering';
import { useNyttSaksbildeoppsett } from '@state/toggles';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { act, render, screen, waitFor } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { ActivePeriod } from '@typer/shared';

vi.mock('@state/person');
vi.mock('@state/risikovurdering');
vi.mock('@state/toggles', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/toggles')>()),
    useNyttSaksbildeoppsett: vi.fn(),
    useUtviklersnacks: () => false,
}));

const { panel } = vi.hoisted(() => ({
    panel:
        (navn: string) =>
        ({ periode }: { periode: ActivePeriod }) =>
            `${navn} for ${periode.id}`,
}));

vi.mock('@saksbilde/utbetaling/Utbetaling', () => ({ Utbetaling: panel('Dagoversiktpanel') }));
vi.mock('@saksbilde/sykepengegrunnlag/Sykepengegrunnlag', () => ({
    Sykepengegrunnlag: panel('Sykepengegrunnlagpanel'),
}));
vi.mock('@saksbilde/vilkår/Inngangsvilkår', () => ({ Inngangsvilkår: panel('Inngangsvilkårpanel') }));
vi.mock('@saksbilde/vurderingsmomenter/Vurderingsmomenter', () => ({
    Vurderingsmomenter: panel('Vurderingsmomenterpanel'),
}));
vi.mock('@saksbilde/varsler/SaksbildevarslerOgBeskjeder', () => ({
    SaksbildevarslerOgBeskjeder: () => <div>Saksbildevarsler</div>,
}));
vi.mock('@saksbilde/saksbildeMenu/dropdown/SaksbildeDropdownMenu', () => ({
    SaksbildeDropdownMenu: () => <div>Saksbildemeny</div>,
}));
vi.mock('@saksbilde/venstremeny/Venstremeny', () => ({ Venstremeny: () => <div>Venstremeny</div> }));
vi.mock('@saksbilde/historikk', () => ({ Historikk: () => <div>Høyremeny</div> }));
vi.mock('@components/flexjar/Tilbakemeldinger', () => ({ Tilbakemelding: { ForSaksbilde: () => null } }));

vi.stubGlobal(
    'ResizeObserver',
    class {
        observe() {}
        disconnect() {}
    },
);

const personPseudoId = 'person-a';
const vilkårsgrunnlagId = '3f1c2a8e-5b7d-4e9a-9c61-2d8f4b7a1e05';
const periode = enBeregnetPeriode({ vilkarsgrunnlagId: vilkårsgrunnlagId });
const person = enPerson({
    arbeidsgivere: [enArbeidsgiver({ behandlinger: [enBehandling({ perioder: [periode] })], ghostPerioder: [] })],
});

const periodeUrl = `/person/${personPseudoId}/periode/${periode.vedtaksperiodeId}/behandling/${periode.behandlingId}`;
const sykefraværstilfelleUrl = `/person/${personPseudoId}/sykefravaerstilfelle/${vilkårsgrunnlagId}`;

const eldrePeriode = enBeregnetPeriode({
    fom: '2020-01-01',
    tom: '2020-01-31',
    vilkarsgrunnlagId: vilkårsgrunnlagId,
});
const nyerePeriode = enBeregnetPeriode({
    fom: '2020-02-01',
    tom: '2020-02-28',
    vilkarsgrunnlagId: vilkårsgrunnlagId,
}).somErTilGodkjenning();
const personMedToPerioder = enPerson({
    arbeidsgivere: [
        enArbeidsgiver({ behandlinger: [enBehandling({ perioder: [nyerePeriode, eldrePeriode] })], ghostPerioder: [] }),
    ],
});
const eldrePeriodeUrl = `/person/${personPseudoId}/periode/${eldrePeriode.vedtaksperiodeId}/behandling/${eldrePeriode.behandlingId}`;

function gåTil(url: string) {
    mockRouter.setCurrentUrl(url);
    window.history.replaceState(null, '', url);
}

// next-router-mock oppdaterer ikke nettleserens URL, som fanehooken leser ankeret fra
function synkNettleserUrlMedRouter() {
    const synk = (url: string) => window.history.pushState(null, '', url);
    mockRouter.events.on('routeChangeComplete', synk);
    mockRouter.events.on('hashChangeComplete', synk);
    return () => {
        mockRouter.events.off('routeChangeComplete', synk);
        mockRouter.events.off('hashChangeComplete', synk);
    };
}

function fanenavn() {
    return screen.getAllByRole('tab').map((tab) => tab.textContent);
}

function valgtFane() {
    return screen.getByRole('tab', { selected: true }).textContent;
}

describe('SaksbildeSide', () => {
    beforeEach(() => {
        sessionStorage.clear();
        (useFetchPersonQuery as Mock).mockReturnValue({ loading: false, data: person });
        (useRisikovurdering as Mock).mockReturnValue(null);
        return synkNettleserUrlMedRouter();
    });

    describe('med toggelen av', () => {
        beforeEach(() => (useNyttSaksbildeoppsett as Mock).mockReturnValue(false));

        it('viser dagens saksbilde', async () => {
            gåTil(periodeUrl);
            render(<SaksbildeSide />);

            expect(fanenavn()).toEqual(['Dagoversikt', 'Inngangsvilkår', 'Sykepengegrunnlag']);
            expect(valgtFane()).toBe('Dagoversikt');
            expect(screen.getByText('Venstremeny')).toBeInTheDocument();
            expect(await screen.findByText('Høyremeny')).toBeInTheDocument();
        });

        it('sender URL-en for sykefraværstilfellet videre til perioden', async () => {
            gåTil(sykefraværstilfelleUrl);
            render(<SaksbildeSide />);

            await waitFor(() => expect(mockRouter.asPath).toBe(`${periodeUrl}#dagoversikt`));
            expect(fanenavn()).toEqual(['Dagoversikt', 'Inngangsvilkår', 'Sykepengegrunnlag']);
        });
    });

    describe('med toggelen på', () => {
        beforeEach(() => (useNyttSaksbildeoppsett as Mock).mockReturnValue(true));

        it('viser Periode-delen med Vedtaksperiode valgt på URL-en for perioden', async () => {
            gåTil(periodeUrl);
            render(<SaksbildeSide />);

            expect(fanenavn()).toEqual(['Vedtaksperiode', 'Sykepengegrunnlag og refusjon', 'Inngangsvilkår']);
            expect(valgtFane()).toBe('Vedtaksperiode');
            expect(screen.getByText(`Dagoversiktpanel for ${periode.id}`)).toBeInTheDocument();
            expect(screen.getByText('Venstremeny')).toBeInTheDocument();
            expect(screen.getByText('Saksbildemeny')).toBeInTheDocument();
            expect(screen.getByText('Saksbildevarsler')).toBeInTheDocument();
            expect(await screen.findByText('Høyremeny')).toBeInTheDocument();
        });

        it('viser ikke Sykefraværstilfellet-delen for en periode uten vilkårsgrunnlag', async () => {
            const periodeUtenVilkårsgrunnlag = enBeregnetPeriode({ vilkarsgrunnlagId: null });
            (useFetchPersonQuery as Mock).mockReturnValue({
                loading: false,
                data: enPerson({
                    arbeidsgivere: [
                        enArbeidsgiver({
                            behandlinger: [enBehandling({ perioder: [periodeUtenVilkårsgrunnlag] })],
                            ghostPerioder: [],
                        }),
                    ],
                }),
            });
            gåTil(
                `/person/${personPseudoId}/periode/${periodeUtenVilkårsgrunnlag.vedtaksperiodeId}/behandling/${periodeUtenVilkårsgrunnlag.behandlingId}`,
            );
            render(<SaksbildeSide />);

            expect(fanenavn()).toEqual(['Vedtaksperiode']);
            expect(await screen.findByText('Høyremeny')).toBeInTheDocument();
        });

        it('viser Sykefraværstilfellet-delen med meny og uten venstremeny på URL-en for sykefraværstilfellet', async () => {
            gåTil(sykefraværstilfelleUrl);
            render(<SaksbildeSide />);

            expect(fanenavn()).toEqual(['Vedtaksperiode', 'Sykepengegrunnlag og refusjon', 'Inngangsvilkår']);
            expect(valgtFane()).toBe('Sykepengegrunnlag og refusjon');
            expect(screen.getByText(`Sykepengegrunnlagpanel for ${periode.id}`)).toBeInTheDocument();
            expect(screen.queryByText('Venstremeny')).not.toBeInTheDocument();
            expect(screen.getByText('Saksbildemeny')).toBeInTheDocument();
            expect(screen.getByText('Saksbildevarsler')).toBeInTheDocument();
            expect(await screen.findByText('Høyremeny')).toBeInTheDocument();
        });

        it('viser Vurderingsmomenter i Periode-delen når perioden har risikofunn', () => {
            (useRisikovurdering as Mock).mockReturnValue({ funn: [{ kategori: [], beskrivelse: 'Et funn' }] });
            gåTil(periodeUrl);
            render(<SaksbildeSide />);

            expect(fanenavn()).toEqual([
                'Vedtaksperiode',
                'Vurderingsmomenter',
                'Sykepengegrunnlag og refusjon',
                'Inngangsvilkår',
            ]);
        });

        it('åpner fanen fra ankeret på URL-en for sykefraværstilfellet', () => {
            gåTil(`${sykefraværstilfelleUrl}#inngangsvilkar`);
            render(<SaksbildeSide />);

            expect(valgtFane()).toBe('Inngangsvilkår');
            expect(screen.getByText(`Inngangsvilkårpanel for ${periode.id}`)).toBeInTheDocument();
        });

        it('legger fanen i Sykefraværstilfellet-delen som anker, så tilbake-knappen går til forrige fane', async () => {
            gåTil(`${sykefraværstilfelleUrl}#sykepengegrunnlag`);
            render(<SaksbildeSide />);

            await userEvent.click(screen.getByRole('tab', { name: 'Inngangsvilkår' }));
            expect(window.location.hash).toBe('#inngangsvilkar');
            expect(valgtFane()).toBe('Inngangsvilkår');

            await act(async () => {
                const tilbake = new Promise((resolve) => window.addEventListener('popstate', resolve, { once: true }));
                window.history.back();
                await tilbake;
            });
            expect(valgtFane()).toBe('Sykepengegrunnlag og refusjon');
        });

        it('viser ikke en periode fra et annet sykefraværstilfelle', () => {
            gåTil(`/person/${personPseudoId}/sykefravaerstilfelle/c7d29e4b-1a6f-4f02-8b3e-5e0a9d6c7f14`);
            render(<SaksbildeSide />);

            expect(screen.getByText('Fant ikke sykefraværstilfellet i Speil')).toBeInTheDocument();
        });

        it('går til fanen i Sykefraværstilfellet-delen for den valgte perioden', async () => {
            gåTil(eldrePeriodeUrl);
            (useFetchPersonQuery as Mock).mockReturnValue({ loading: false, data: personMedToPerioder });
            render(<SaksbildeSide />);

            await userEvent.click(screen.getByRole('tab', { name: 'Inngangsvilkår' }));

            expect(mockRouter.asPath).toBe(`${sykefraværstilfelleUrl}#inngangsvilkar`);
            expect(valgtFane()).toBe('Inngangsvilkår');
            expect(screen.getByText(`Inngangsvilkårpanel for ${eldrePeriode.id}`)).toBeInTheDocument();
            expect(screen.queryByText('Venstremeny')).not.toBeInTheDocument();
        });

        it('går tilbake til den samme perioden i Periode-delen', async () => {
            gåTil(eldrePeriodeUrl);
            (useFetchPersonQuery as Mock).mockReturnValue({ loading: false, data: personMedToPerioder });
            render(<SaksbildeSide />);
            await userEvent.click(screen.getByRole('tab', { name: 'Sykepengegrunnlag og refusjon' }));

            await userEvent.click(screen.getByRole('tab', { name: 'Vedtaksperiode' }));

            expect(mockRouter.asPath).toBe(`${eldrePeriodeUrl}#dagoversikt`);
            expect(valgtFane()).toBe('Vedtaksperiode');
            expect(screen.getByText(`Dagoversiktpanel for ${eldrePeriode.id}`)).toBeInTheDocument();
        });
    });
});

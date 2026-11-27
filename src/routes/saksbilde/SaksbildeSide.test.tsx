import mockRouter from 'next-router-mock';
import { useEffect } from 'react';
import { Mock } from 'vitest';

import { SaksbildeSide } from '@saksbilde/SaksbildeSide';
import { useSetActivePeriodIdUtenPerson } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { useRisikovurdering } from '@state/risikovurdering';
import { useNyttSaksbildeoppsett } from '@state/toggles';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enGhostPeriode, enUberegnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';
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
const sykefraværstilfelleUrl = `/person/${personPseudoId}/sykefravaerstilfelle/2020-01-01`;

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

const ghostPeriode = enGhostPeriode({ vilkarsgrunnlagId: vilkårsgrunnlagId, organisasjonsnummer: '123456789' });
const personMedGhostPeriode = enPerson({
    arbeidsgivere: [
        enArbeidsgiver({ behandlinger: [enBehandling({ perioder: [periode] })], ghostPerioder: [] }),
        enArbeidsgiver({ organisasjonsnummer: '123456789', behandlinger: [], ghostPerioder: [ghostPeriode] }),
    ],
});
const ghostPeriodeUrl = `/person/${personPseudoId}/periode/${ghostPeriode.id}`;

const uberegnetPeriode = enUberegnetPeriode();
const uberegnetPeriodeUrl = `/person/${personPseudoId}/periode/${uberegnetPeriode.vedtaksperiodeId}/behandling/${uberegnetPeriode.behandlingId}`;
const personMedBeregnetOgUberegnetPeriode = enPerson({
    arbeidsgivere: [
        enArbeidsgiver({ behandlinger: [enBehandling({ perioder: [periode] })], ghostPerioder: [] }),
        enArbeidsgiver({
            organisasjonsnummer: '123456789',
            behandlinger: [enBehandling({ perioder: [uberegnetPeriode] })],
            ghostPerioder: [],
        }),
    ],
});
const personMedBareUberegnetPeriode = enPerson({
    arbeidsgivere: [
        enArbeidsgiver({ behandlinger: [enBehandling({ perioder: [uberegnetPeriode] })], ghostPerioder: [] }),
    ],
});

function gåTil(url: string) {
    mockRouter.setCurrentUrl(url);
    window.history.replaceState(null, '', url);
}

// next-router-mock oppdaterer ikke nettleserens URL, som tab-hooken leser ankeret fra
function synkNettleserUrlMedRouter() {
    const synk = (url: string) => window.history.pushState(null, '', url);
    mockRouter.events.on('routeChangeComplete', synk);
    mockRouter.events.on('hashChangeComplete', synk);
    return () => {
        mockRouter.events.off('routeChangeComplete', synk);
        mockRouter.events.off('hashChangeComplete', synk);
    };
}

function VelgPeriode({ id }: { id: string }) {
    const velg = useSetActivePeriodIdUtenPerson();
    useEffect(() => velg(id), [id, velg]);
    return null;
}

function tabnavn() {
    return screen.getAllByRole('tab').map((tab) => tab.textContent);
}

function valgtTab() {
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

            expect(tabnavn()).toEqual(['Dagoversikt', 'Inngangsvilkår', 'Sykepengegrunnlag']);
            expect(valgtTab()).toBe('Dagoversikt');
            expect(screen.getByText('Venstremeny')).toBeInTheDocument();
            expect(await screen.findByText('Høyremeny')).toBeInTheDocument();
        });

        it('sender URL-en for sykefraværstilfellet videre til perioden', async () => {
            gåTil(sykefraværstilfelleUrl);
            render(<SaksbildeSide />);

            await waitFor(() => expect(mockRouter.asPath).toBe(`${periodeUrl}#dagoversikt`));
            expect(tabnavn()).toEqual(['Dagoversikt', 'Inngangsvilkår', 'Sykepengegrunnlag']);
        });

        it('viser bare Sykepengegrunnlag for en ghost-periode', async () => {
            (useFetchPersonQuery as Mock).mockReturnValue({ loading: false, data: personMedGhostPeriode });
            gåTil(`${ghostPeriodeUrl}#dagoversikt`);
            render(<SaksbildeSide />);

            await waitFor(() => expect(window.location.hash).toBe('#sykepengegrunnlag'));
            expect(tabnavn()).toEqual(['Sykepengegrunnlag']);
            expect(screen.getByText(`Sykepengegrunnlagpanel for ${ghostPeriode.id}`)).toBeInTheDocument();
        });
    });

    describe('med toggelen på', () => {
        beforeEach(() => (useNyttSaksbildeoppsett as Mock).mockReturnValue(true));

        it('viser tabgruppen Periode med Vedtaksperiode valgt på URL-en for perioden', async () => {
            gåTil(periodeUrl);
            render(<SaksbildeSide />);

            expect(tabnavn()).toEqual(['Vedtaksperiode', 'Sykepengegrunnlag', 'Inngangsvilkår']);
            expect(valgtTab()).toBe('Vedtaksperiode');
            expect(screen.getByText(`Dagoversiktpanel for ${periode.id}`)).toBeInTheDocument();
            expect(screen.getByText('Venstremeny')).toBeInTheDocument();
            expect(screen.getByText('Saksbildemeny')).toBeInTheDocument();
            expect(screen.getByText('Saksbildevarsler')).toBeInTheDocument();
            expect(await screen.findByText('Høyremeny')).toBeInTheDocument();
        });

        it('viser ikke tabgruppen Sykefraværstilfellet for en periode uten vilkårsgrunnlag', async () => {
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

            expect(tabnavn()).toEqual(['Vedtaksperiode']);
            expect(await screen.findByText('Høyremeny')).toBeInTheDocument();
        });

        it('viser tabgruppen Sykefraværstilfellet med meny og uten venstremeny på URL-en for sykefraværstilfellet', async () => {
            gåTil(sykefraværstilfelleUrl);
            render(<SaksbildeSide />);

            expect(tabnavn()).toEqual(['Vedtaksperiode', 'Sykepengegrunnlag', 'Inngangsvilkår']);
            expect(valgtTab()).toBe('Sykepengegrunnlag');
            expect(screen.getByText(`Sykepengegrunnlagpanel for ${periode.id}`)).toBeInTheDocument();
            expect(screen.queryByText('Venstremeny')).not.toBeInTheDocument();
            expect(screen.getByText('Saksbildemeny')).toBeInTheDocument();
            expect(screen.getByText('Saksbildevarsler')).toBeInTheDocument();
            expect(await screen.findByText('Høyremeny')).toBeInTheDocument();
        });

        it('viser Vurderingsmomenter i tabgruppen Periode når perioden har risikofunn', () => {
            (useRisikovurdering as Mock).mockReturnValue({ funn: [{ kategori: [], beskrivelse: 'Et funn' }] });
            gåTil(periodeUrl);
            render(<SaksbildeSide />);

            expect(tabnavn()).toEqual(['Vedtaksperiode', 'Vurderingsmomenter', 'Sykepengegrunnlag', 'Inngangsvilkår']);
        });

        it('åpner taben fra ankeret på URL-en for sykefraværstilfellet', () => {
            gåTil(`${sykefraværstilfelleUrl}#inngangsvilkar`);
            render(<SaksbildeSide />);

            expect(valgtTab()).toBe('Inngangsvilkår');
            expect(screen.getByText(`Inngangsvilkårpanel for ${periode.id}`)).toBeInTheDocument();
        });

        it('legger taben i tabgruppen Sykefraværstilfellet som anker, så tilbake-knappen går til forrige tab', async () => {
            gåTil(`${sykefraværstilfelleUrl}#sykepengegrunnlag`);
            render(<SaksbildeSide />);

            await userEvent.click(screen.getByRole('tab', { name: 'Inngangsvilkår' }));
            expect(window.location.hash).toBe('#inngangsvilkar');
            expect(valgtTab()).toBe('Inngangsvilkår');

            await act(async () => {
                const tilbake = new Promise((resolve) => window.addEventListener('popstate', resolve, { once: true }));
                window.history.back();
                await tilbake;
            });
            expect(valgtTab()).toBe('Sykepengegrunnlag');
        });

        it('viser ikke en periode fra et annet sykefraværstilfelle', () => {
            gåTil(`/person/${personPseudoId}/sykefravaerstilfelle/2019-01-01`);
            render(<SaksbildeSide />);

            expect(screen.getByText('Fant ikke sykefraværstilfellet i Speil')).toBeInTheDocument();
        });

        it('går til taben i tabgruppen Sykefraværstilfellet for den valgte perioden', async () => {
            gåTil(eldrePeriodeUrl);
            (useFetchPersonQuery as Mock).mockReturnValue({ loading: false, data: personMedToPerioder });
            render(<SaksbildeSide />);

            await userEvent.click(screen.getByRole('tab', { name: 'Inngangsvilkår' }));

            expect(mockRouter.asPath).toBe(`${sykefraværstilfelleUrl}#inngangsvilkar`);
            expect(valgtTab()).toBe('Inngangsvilkår');
            expect(screen.getByText(`Inngangsvilkårpanel for ${eldrePeriode.id}`)).toBeInTheDocument();
            expect(screen.queryByText('Venstremeny')).not.toBeInTheDocument();
        });

        it('går tilbake til den samme perioden i tabgruppen Periode', async () => {
            gåTil(eldrePeriodeUrl);
            (useFetchPersonQuery as Mock).mockReturnValue({ loading: false, data: personMedToPerioder });
            render(<SaksbildeSide />);
            await userEvent.click(screen.getByRole('tab', { name: 'Sykepengegrunnlag' }));

            await userEvent.click(screen.getByRole('tab', { name: 'Vedtaksperiode' }));

            expect(mockRouter.asPath).toBe(`${eldrePeriodeUrl}#dagoversikt`);
            expect(valgtTab()).toBe('Vedtaksperiode');
            expect(screen.getByText(`Dagoversiktpanel for ${eldrePeriode.id}`)).toBeInTheDocument();
        });

        it('sender en gammel URL med vilkårsgrunnlaget videre til URL-en med skjæringstidspunktet', async () => {
            (useFetchPersonQuery as Mock).mockReturnValue({
                loading: false,
                data: {
                    ...person,
                    vilkarsgrunnlagV2: [
                        etVilkårsgrunnlagFraSpleis({ id: vilkårsgrunnlagId, skjaeringstidspunkt: '2020-01-01' }),
                    ],
                },
            });
            gåTil(`/person/${personPseudoId}/sykefravaerstilfelle/${vilkårsgrunnlagId}#inngangsvilkar`);
            const replace = vi.spyOn(mockRouter, 'replace');
            render(<SaksbildeSide />);

            await waitFor(() => expect(mockRouter.asPath).toBe(`${sykefraværstilfelleUrl}#inngangsvilkar`));
            expect(replace).toHaveBeenCalled();
            expect(valgtTab()).toBe('Inngangsvilkår');
            replace.mockRestore();
        });

        describe('for en uberegnet periode', () => {
            it('viser Vedtaksperiode og Sykepengegrunnlag', async () => {
                (useFetchPersonQuery as Mock).mockReturnValue({
                    loading: false,
                    data: personMedBeregnetOgUberegnetPeriode,
                });
                gåTil(`${uberegnetPeriodeUrl}#dagoversikt`);
                render(<SaksbildeSide />);

                expect(tabnavn()).toEqual(['Vedtaksperiode', 'Sykepengegrunnlag']);
                expect(await screen.findByText('Venstremeny')).toBeInTheDocument();
            });

            it('viser grunnlaget når en periode i sykefraværstilfellet er beregnet', async () => {
                (useFetchPersonQuery as Mock).mockReturnValue({
                    loading: false,
                    data: personMedBeregnetOgUberegnetPeriode,
                });
                gåTil(`${uberegnetPeriodeUrl}#dagoversikt`);
                render(<SaksbildeSide />);

                await userEvent.click(screen.getByRole('tab', { name: 'Sykepengegrunnlag' }));

                expect(mockRouter.asPath).toBe(`${sykefraværstilfelleUrl}#sykepengegrunnlag`);
                expect(tabnavn()).toEqual(['Vedtaksperiode', 'Sykepengegrunnlag']);
                expect(screen.getByText(`Sykepengegrunnlagpanel for ${periode.id}`)).toBeInTheDocument();
            });

            it('går til Sykepengegrunnlag når saksbehandler står på Inngangsvilkår og velger en uberegnet periode', async () => {
                (useFetchPersonQuery as Mock).mockReturnValue({
                    loading: false,
                    data: personMedBeregnetOgUberegnetPeriode,
                });
                gåTil(`${sykefraværstilfelleUrl}#inngangsvilkar`);
                render(
                    <>
                        <VelgPeriode id={uberegnetPeriode.id} />
                        <SaksbildeSide />
                    </>,
                );

                await waitFor(() => expect(valgtTab()).toBe('Sykepengegrunnlag'));
                expect(window.location.hash).toBe('#sykepengegrunnlag');
                expect(screen.getByText(`Sykepengegrunnlagpanel for ${periode.id}`)).toBeInTheDocument();
            });

            it('viser en beskjed når ingen perioder i sykefraværstilfellet er beregnet', async () => {
                (useFetchPersonQuery as Mock).mockReturnValue({ loading: false, data: personMedBareUberegnetPeriode });
                gåTil(`${uberegnetPeriodeUrl}#dagoversikt`);
                render(<SaksbildeSide />);

                await userEvent.click(screen.getByRole('tab', { name: 'Sykepengegrunnlag' }));

                expect(mockRouter.asPath).toBe(`${sykefraværstilfelleUrl}#sykepengegrunnlag`);
                expect(screen.getByText(/Perioden er ikke beregnet ennå/)).toBeInTheDocument();
            });
        });

        describe('for en ghost-periode', () => {
            beforeEach(() =>
                (useFetchPersonQuery as Mock).mockReturnValue({ loading: false, data: personMedGhostPeriode }),
            );

            it('viser alle tabene og en melding om at det ikke finnes en vedtaksperiode', async () => {
                gåTil(`${ghostPeriodeUrl}#dagoversikt`);
                render(<SaksbildeSide />);

                expect(tabnavn()).toEqual(['Vedtaksperiode', 'Sykepengegrunnlag', 'Inngangsvilkår']);
                expect(valgtTab()).toBe('Vedtaksperiode');
                expect(screen.getByText(/Arbeidsforhold uten sykefravær/)).toBeInTheDocument();
                expect(mockRouter.asPath).toBe(`${ghostPeriodeUrl}#dagoversikt`);
                expect(await screen.findByText('Venstremeny')).toBeInTheDocument();
            });

            it('viser inngangsvilkårene til sykefraværstilfellet', async () => {
                gåTil(`${ghostPeriodeUrl}#dagoversikt`);
                render(<SaksbildeSide />);

                await userEvent.click(screen.getByRole('tab', { name: 'Inngangsvilkår' }));

                expect(mockRouter.asPath).toBe(`${sykefraværstilfelleUrl}#inngangsvilkar`);
                expect(valgtTab()).toBe('Inngangsvilkår');
                expect(screen.getByText(`Inngangsvilkårpanel for ${periode.id}`)).toBeInTheDocument();
            });

            it('viser sykepengegrunnlaget for ghost-perioden', async () => {
                gåTil(`${ghostPeriodeUrl}#dagoversikt`);
                render(<SaksbildeSide />);

                await userEvent.click(screen.getByRole('tab', { name: 'Sykepengegrunnlag' }));

                expect(mockRouter.asPath).toBe(`${sykefraværstilfelleUrl}#sykepengegrunnlag`);
                expect(screen.getByText(`Sykepengegrunnlagpanel for ${ghostPeriode.id}`)).toBeInTheDocument();
            });
        });
    });
});

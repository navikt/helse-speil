import mockRouter from 'next-router-mock';
import { Mock } from 'vitest';

import { useGetInfotrygdperioderForPerson } from '@io/rest/generated/personer/personer';
import { ApiBeregnetPeriode, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { Tidslinje } from '@saksbilde/tidslinje/Tidslinje';
import { useFetchPersonQuery } from '@state/person';
import { useNyttSaksbildeoppsett } from '@state/toggles';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { render } from '@test-utils';

vi.mock('@state/person');
vi.mock('@state/toggles', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/toggles')>()),
    useNyttSaksbildeoppsett: vi.fn(),
    useUtviklersnacks: () => false,
}));
vi.mock('@io/rest/generated/personer/personer', () => ({ useGetInfotrygdperioderForPerson: vi.fn() }));
vi.mock('@io/rest/generated/notater/notater', () => ({
    useGetNotatVedtaksperiodeIderForPerson: () => ({ data: [], isLoading: false }),
}));
vi.mock('@state/tilkommenInntekt', () => ({ useHentTilkommenInntektQuery: () => ({ data: [] }) }));
vi.mock('@external/sparkel-aareg/useOrganisasjonQuery', () => ({
    useOrganisasjonQuery: () => ({ data: undefined, isLoading: false }),
    useOrganisasjonerQuery: () => ({ navnMap: new Map(), isLoading: false }),
}));
vi.mock('@state/oppgave', () => ({ usePeriodeIdMedAktivOppgave: () => null }));
vi.mock('@state/totrinnsvurdering', () => ({ useHarBeslutteroppgave: () => false }));
vi.mock('@hooks/brukerrolleHooks', () => ({ useHarUtviklerRolle: () => false }));
// Vitest bundler @navikt/ds-react, så ToggleGroup og ToggleGroupItem får hver sin kontekst
vi.mock('@saksbilde/tidslinje/timeline/zoom/TimelineZoom', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@saksbilde/tidslinje/timeline/zoom/TimelineZoom')>()),
    TimelineZoom: Object.assign(() => null, { componentType: 'TimelineZoom' }),
}));

vi.stubGlobal(
    'ResizeObserver',
    class {
        observe() {}
        disconnect() {}
    },
);

const personPseudoId = 'person-a';
const vilkårsgrunnlagId = '3f1c2a8e-5b7d-4e9a-9c61-2d8f4b7a1e05';
const annetVilkårsgrunnlagId = '8a4e6d21-0c3f-4b8e-a5d7-6f9b2c1e4d38';
const sykefraværstilfelleUrl = `/person/${personPseudoId}/sykefravaerstilfelle/${vilkårsgrunnlagId}`;

const januar = enBeregnetPeriode({
    fom: '2020-01-01',
    tom: '2020-01-31',
    vilkarsgrunnlagId: vilkårsgrunnlagId,
}).somErTilGodkjenning();
const februar = enBeregnetPeriode({ fom: '2020-02-01', tom: '2020-02-29', vilkarsgrunnlagId: vilkårsgrunnlagId });
const juni = enBeregnetPeriode({
    fom: '2020-06-01',
    tom: '2020-06-30',
    skjaeringstidspunkt: '2020-06-01',
    vilkarsgrunnlagId: annetVilkårsgrunnlagId,
});
const hosB = enBeregnetPeriode({ fom: '2020-01-01', tom: '2020-01-20', vilkarsgrunnlagId: vilkårsgrunnlagId });
const ghostHosC = enGhostPeriode({ fom: '2020-01-01', tom: '2020-02-29', vilkarsgrunnlagId: vilkårsgrunnlagId });

// Radene er A, B, C og Infotrygd
const person = enPerson({
    arbeidsgivere: [
        enArbeidsgiver({ behandlinger: [enBehandling({ perioder: [juni, februar, januar] })], ghostPerioder: [] }),
        enArbeidsgiver({ behandlinger: [enBehandling({ perioder: [hosB] })], ghostPerioder: [] }),
        enArbeidsgiver({ behandlinger: [], ghostPerioder: [ghostHosC] }),
    ],
});

describe('Tidslinje', () => {
    beforeEach(() => {
        (useGetInfotrygdperioderForPerson as Mock).mockReturnValue({
            data: [{ fom: '2019-01-01', tom: '2019-01-31' }],
            isLoading: false,
        });
    });

    describe('med toggelen på', () => {
        beforeEach(() => (useNyttSaksbildeoppsett as Mock).mockReturnValue(true));

        it('markerer bare den valgte perioden i tabgruppen Periode', () => {
            gåTil(periodeUrl(februar));
            const { container } = renderTidslinje();

            expect(perioderIRad(container, 0).map(erAktiv)).toEqual([false, true, false]);
            expect(container.querySelectorAll('[data-i-sykefravaerstilfellet]')).toHaveLength(0);
            expect(container.querySelectorAll('[data-sykefravaerstilfelle-ramme]')).toHaveLength(0);
        });

        it('markerer periodene i sykefraværstilfellet hos alle arbeidsgivere, også ghost-perioder', () => {
            gåTil(sykefraværstilfelleUrl);
            const { container } = renderTidslinje();

            expect(perioderIRad(container, 0).map(erMarkert)).toEqual([false, true, true]);
            expect(perioderIRad(container, 1).map(erMarkert)).toEqual([true]);
            expect(perioderIRad(container, 2).map(erMarkert)).toEqual([true]);
        });

        it('markerer periodene for selvstendig næring', () => {
            const selvstendigPeriode = enBeregnetPeriode({
                fom: '2020-01-01',
                tom: '2020-01-31',
                vilkarsgrunnlagId: vilkårsgrunnlagId,
            });
            gåTil(sykefraværstilfelleUrl);
            const { container } = renderTidslinje(
                enPerson({
                    arbeidsgivere: [
                        enArbeidsgiver({ behandlinger: [enBehandling({ perioder: [januar] })], ghostPerioder: [] }),
                    ],
                    selvstendigNaering: { behandlinger: [enBehandling({ perioder: [selvstendigPeriode] })] },
                }),
            );

            // Selvstendig næring står øverst
            expect(perioderIRad(container, 0).map(erMarkert)).toEqual([true]);
            expect(perioderIRad(container, 1).map(erMarkert)).toEqual([true]);
        });

        it('markerer den valgte perioden ekstra inne i sykefraværstilfellet', () => {
            gåTil(sykefraværstilfelleUrl);
            const { container } = renderTidslinje();

            expect(perioderIRad(container, 0).map(erAktiv)).toEqual([false, false, true]);
            expect(container.querySelectorAll('[data-active-period]')).toHaveLength(1);
        });

        it('markerer ikke Infotrygd-raden', () => {
            gåTil(sykefraværstilfelleUrl);
            const { container } = renderTidslinje();

            expect(perioderIRad(container, 3).map((periode) => periode.dataset.periodVariant)).toEqual(['infotrygd']);
            expect(perioderIRad(container, 3).map(erMarkert)).toEqual([false]);
            expect(rammerIRad(container, 3)).toHaveLength(0);
        });

        it('gir perioder som ligger inntil hverandre på samme rad én felles ramme', () => {
            gåTil(sykefraværstilfelleUrl);
            const { container } = renderTidslinje();

            expect(rammerIRad(container, 0)).toHaveLength(1);
            expect(rammerIRad(container, 1)).toHaveLength(1);
            expect(rammerIRad(container, 2)).toHaveLength(1);
        });

        it('gir perioder med bare helg imellom én felles ramme', () => {
            // 31. januar 2020 er en fredag
            const fraMandag = enBeregnetPeriode({
                fom: '2020-02-03',
                tom: '2020-02-29',
                vilkarsgrunnlagId: vilkårsgrunnlagId,
            });
            gåTil(sykefraværstilfelleUrl);
            const { container } = renderTidslinje(
                enPerson({
                    arbeidsgivere: [
                        enArbeidsgiver({
                            behandlinger: [enBehandling({ perioder: [fraMandag, januar] })],
                            ghostPerioder: [],
                        }),
                    ],
                }),
            );

            expect(perioderIRad(container, 0).map(erMarkert)).toEqual([true, true]);
            expect(rammerIRad(container, 0)).toHaveLength(1);
        });

        it('gir perioder med opphold imellom hver sin ramme', () => {
            const mars = enBeregnetPeriode({
                fom: '2020-03-10',
                tom: '2020-03-31',
                vilkarsgrunnlagId: vilkårsgrunnlagId,
            });
            gåTil(sykefraværstilfelleUrl);
            const { container } = renderTidslinje(
                enPerson({
                    arbeidsgivere: [
                        enArbeidsgiver({
                            behandlinger: [enBehandling({ perioder: [mars, februar, januar] })],
                            ghostPerioder: [],
                        }),
                    ],
                }),
            );

            expect(perioderIRad(container, 0).map(erMarkert)).toEqual([true, true, true]);
            expect(rammerIRad(container, 0)).toHaveLength(2);
        });

        it('markerer periodene i den eldre behandlingen som hørte til grunnlaget den gangen', () => {
            const nyereJanuar = enBeregnetPeriode({
                fom: '2020-01-01',
                tom: '2020-01-31',
                vilkarsgrunnlagId: annetVilkårsgrunnlagId,
            });
            const nyereFebruar = enBeregnetPeriode({
                fom: '2020-02-01',
                tom: '2020-02-29',
                vilkarsgrunnlagId: annetVilkårsgrunnlagId,
            });
            const eldreJanuar = enBeregnetPeriode({
                fom: '2020-01-01',
                tom: '2020-01-31',
                vedtaksperiodeId: nyereJanuar.vedtaksperiodeId,
                vilkarsgrunnlagId: vilkårsgrunnlagId,
            });
            const eldreFebruar = enBeregnetPeriode({
                fom: '2020-02-01',
                tom: '2020-02-29',
                vedtaksperiodeId: nyereFebruar.vedtaksperiodeId,
                vilkarsgrunnlagId: vilkårsgrunnlagId,
            });
            gåTil(sykefraværstilfelleUrl);
            const { container } = renderTidslinje(
                enPerson({
                    arbeidsgivere: [
                        enArbeidsgiver({
                            behandlinger: [
                                enBehandling({ perioder: [nyereFebruar, nyereJanuar] }),
                                enBehandling({ perioder: [eldreFebruar, eldreJanuar] }),
                            ],
                            ghostPerioder: [],
                        }),
                    ],
                }),
            );

            // Raden med den eldre behandlingen åpnes fordi den valgte perioden ligger der
            expect(perioderIRad(container, 0).map(erMarkert)).toEqual([false, false, true, true]);
            expect(perioderIRad(container, 0).map(erAktiv)).toEqual([false, false, true, false]);
        });
        it('åpner radene der en periode i sykefraværstilfellet ligger i en eldre behandling', () => {
            const nyA = enBeregnetPeriode({ vilkarsgrunnlagId: annetVilkårsgrunnlagId });
            const gammelA = enBeregnetPeriode({
                vedtaksperiodeId: nyA.vedtaksperiodeId,
                vilkarsgrunnlagId: vilkårsgrunnlagId,
            });
            const nyB = enBeregnetPeriode({ vilkarsgrunnlagId: annetVilkårsgrunnlagId });
            const gammelB = enBeregnetPeriode({
                vedtaksperiodeId: nyB.vedtaksperiodeId,
                vilkarsgrunnlagId: vilkårsgrunnlagId,
            });
            gåTil(sykefraværstilfelleUrl);
            const { container } = renderTidslinje(
                enPerson({
                    arbeidsgivere: [
                        enArbeidsgiver({
                            behandlinger: [enBehandling({ perioder: [nyA] }), enBehandling({ perioder: [gammelA] })],
                            ghostPerioder: [],
                        }),
                        enArbeidsgiver({
                            behandlinger: [enBehandling({ perioder: [nyB] }), enBehandling({ perioder: [gammelB] })],
                            ghostPerioder: [],
                        }),
                    ],
                }),
            );

            expect(perioderIRad(container, 0).map(erMarkert)).toEqual([false, true]);
            expect(perioderIRad(container, 1).map(erMarkert)).toEqual([false, true]);
        });
    });

    describe('med toggelen av', () => {
        beforeEach(() => (useNyttSaksbildeoppsett as Mock).mockReturnValue(false));

        it('markerer bare den valgte perioden', () => {
            gåTil(periodeUrl(februar));
            const { container } = renderTidslinje();

            expect(perioderIRad(container, 0).map(erAktiv)).toEqual([false, true, false]);
            expect(container.querySelectorAll('[data-i-sykefravaerstilfellet]')).toHaveLength(0);
            expect(container.querySelectorAll('[data-sykefravaerstilfelle-ramme]')).toHaveLength(0);
        });
    });
});

function periodeUrl(periode: ApiBeregnetPeriode) {
    return `/person/${personPseudoId}/periode/${periode.vedtaksperiodeId}/behandling/${periode.behandlingId}`;
}

function gåTil(url: string) {
    mockRouter.setCurrentUrl(url);
    window.history.replaceState(null, '', url);
}

function renderTidslinje(medPerson: ApiSaksbildePerson = person) {
    (useFetchPersonQuery as Mock).mockReturnValue({ loading: false, data: medPerson });
    return render(<Tidslinje />);
}

function rader(container: HTMLElement): HTMLElement[] {
    return [...container.querySelectorAll<HTMLElement>('[data-tidslinjerad]')];
}

// Nyeste periode først, og nyeste behandling før eldre
function perioderIRad(container: HTMLElement, rad: number): HTMLElement[] {
    return [...rader(container)[rad]!.querySelectorAll<HTMLElement>('[data-period-variant]')];
}

function rammerIRad(container: HTMLElement, rad: number) {
    return rader(container)[rad]!.querySelectorAll('[data-sykefravaerstilfelle-ramme]');
}

function erMarkert(periode: HTMLElement) {
    return periode.hasAttribute('data-i-sykefravaerstilfellet');
}

function erAktiv(periode: HTMLElement) {
    return periode.hasAttribute('data-active-period');
}

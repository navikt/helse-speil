import mockRouter from 'next-router-mock';
import { Mock } from 'vitest';

import { ApiBeregnetPeriode, ApiPeriodetilstand } from '@io/rest/generated/spesialist.schemas';
import { useNyttSaksbildeoppsett } from '@state/toggles';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { act, renderHook } from '@test-utils';
import { erPåPeriodeside, lagPeriodeUrl } from '@utils/undersider';

import {
    periodeUrlIdFor,
    useActivePeriod,
    useSelectPeriod,
    useSetActivePeriodIdUtenPerson,
    useSistValgtePeriode,
    useSynkroniserValgtPeriodeMedUrl,
} from './periode';

vi.mock('@state/toggles', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/toggles')>()),
    useNyttSaksbildeoppsett: vi.fn(() => false),
}));

describe('useActivePeriod', () => {
    const vedtaksperiodeId = 'vedtaksperiode-1';
    const nyestePeriode = enBeregnetPeriode({ vedtaksperiodeId, fom: '2020-02-01', tom: '2020-02-28' });
    const eldrePeriode = enBeregnetPeriode({ vedtaksperiodeId, fom: '2020-02-01', tom: '2020-02-28' });
    const eldsteBehandlingId = 'behandling-eldst';
    const eldstePeriodeINyereRad = enBeregnetPeriode({
        vedtaksperiodeId: 'vedtaksperiode-2',
        behandlingId: eldsteBehandlingId,
        fom: '2019-12-01',
        tom: '2019-12-31',
    });
    const eldstePeriodeIEldreRad = enBeregnetPeriode({
        vedtaksperiodeId: 'vedtaksperiode-2',
        behandlingId: eldsteBehandlingId,
        fom: '2019-12-01',
        tom: '2019-12-31',
    });
    const annenPeriode = enBeregnetPeriode({ fom: '2020-01-01', tom: '2020-01-31' });
    const ghostPeriode = enGhostPeriode();
    const person = enPerson({
        arbeidsgivere: [
            enArbeidsgiver({
                behandlinger: [
                    enBehandling({ perioder: [nyestePeriode, annenPeriode, eldstePeriodeINyereRad] }),
                    enBehandling({ perioder: [eldrePeriode, eldstePeriodeIEldreRad] }),
                ],
                ghostPerioder: [ghostPeriode],
            }),
        ],
    });

    it('velger perioden fra nyeste behandling som matcher vedtaksperiodeId i URL-en', () => {
        mockRouter.setCurrentUrl(`/person/person-a/periode/${vedtaksperiodeId}`);
        const { result } = renderHook(() => useActivePeriod(person));

        expect(result.current?.id).toBe(nyestePeriode.id);
    });

    it('velger historisk pølse når behandlingId er i URL-en', () => {
        mockRouter.setCurrentUrl(
            `/person/person-a/periode/${vedtaksperiodeId}/behandling/${eldrePeriode.behandlingId}`,
        );
        const { result } = renderHook(() => useActivePeriod(person));

        expect(result.current?.id).toBe(eldrePeriode.id);
    });

    it('velger nyeste pølserad når samme behandling finnes i flere rader', () => {
        mockRouter.setCurrentUrl(`/person/person-a/periode/vedtaksperiode-2/behandling/${eldsteBehandlingId}`);
        const { result } = renderHook(() => useActivePeriod(person));

        expect(result.current?.id).toBe(eldstePeriodeINyereRad.id);
    });

    it('faller tilbake til nyeste behandling når behandlingId ikke finnes på vedtaksperioden', () => {
        mockRouter.setCurrentUrl(`/person/person-a/periode/${vedtaksperiodeId}/behandling/finnes-ikke`);
        const { result } = renderHook(() => useActivePeriod(person));

        expect(result.current?.id).toBe(nyestePeriode.id);
    });

    it('lager URL-id med behandlingId for beregnede perioder', () => {
        expect(periodeUrlIdFor(eldrePeriode)).toEqual({
            periodeId: vedtaksperiodeId,
            behandlingId: eldrePeriode.behandlingId,
        });
    });

    it('bruker id for ghostperioder', () => {
        mockRouter.setCurrentUrl(`/person/person-a/periode/${ghostPeriode.id}`);
        const { result } = renderHook(() => useActivePeriod(person));

        expect(result.current?.id).toBe(ghostPeriode.id);
        expect(periodeUrlIdFor(ghostPeriode)).toEqual({ periodeId: ghostPeriode.id });
    });

    it('gir ingen aktiv periode når perioden i URL-en ikke finnes', () => {
        mockRouter.setCurrentUrl('/person/person-a/periode/finnes-ikke');
        const { result } = renderHook(() => useActivePeriod(person));

        expect(result.current).toBeNull();
    });

    it('husker perioden fra URL-en når den endres uten klikk i tidslinjen', () => {
        mockRouter.setCurrentUrl(
            `/person/person-a/periode/${vedtaksperiodeId}/behandling/${eldrePeriode.behandlingId}`,
        );
        const { result, rerender } = renderHook(() => {
            const aktivPeriode = useActivePeriod(person);
            useSynkroniserValgtPeriodeMedUrl(aktivPeriode);
            return useSistValgtePeriode(person);
        });
        expect(result.current?.id).toBe(eldrePeriode.id);

        act(() => mockRouter.setCurrentUrl(`/person/person-a/periode/${vedtaksperiodeId}`));
        rerender();
        expect(result.current?.id).toBe(nyestePeriode.id);
    });

    it('beholder valgt pølserad når samme behandling ligger i flere rader', () => {
        mockRouter.setCurrentUrl(`/person/person-a/periode/vedtaksperiode-2/behandling/${eldsteBehandlingId}`);
        const { result } = renderHook(() => {
            const aktivPeriode = useActivePeriod(person);
            useSynkroniserValgtPeriodeMedUrl(aktivPeriode);
            return { aktivPeriode, setActivePeriodId: useSetActivePeriodIdUtenPerson() };
        });

        act(() => result.current.setActivePeriodId(eldstePeriodeIEldreRad.id));
        expect(result.current.aktivPeriode?.id).toBe(eldstePeriodeIEldreRad.id);
    });
});

describe('useActivePeriod på URL-en for sykefraværstilfellet', () => {
    const vilkårsgrunnlagIdJanuar = '3f1c2a8e-5b7d-4e9a-9c61-2d8f4b7a1e05';
    const vilkårsgrunnlagIdJuni = '8a4e6d21-0c3f-4b8e-a5d7-6f9b2c1e4d38';
    const periodeIJanuar = enBeregnetPeriode({
        fom: '2020-01-01',
        tom: '2020-01-31',
        vilkarsgrunnlagId: vilkårsgrunnlagIdJanuar,
    });
    const periodeIFebruar = enBeregnetPeriode({
        fom: '2020-02-01',
        tom: '2020-02-28',
        vilkarsgrunnlagId: vilkårsgrunnlagIdJanuar,
    });
    const periodeIJuni = enBeregnetPeriode({
        fom: '2020-06-01',
        tom: '2020-06-30',
        vilkarsgrunnlagId: vilkårsgrunnlagIdJuni,
    });
    const person = enPerson({
        arbeidsgivere: [
            enArbeidsgiver({
                behandlinger: [enBehandling({ perioder: [periodeIJuni, periodeIFebruar, periodeIJanuar] })],
                ghostPerioder: [],
            }),
        ],
    });

    beforeEach(() => (useNyttSaksbildeoppsett as Mock).mockReturnValue(true));
    afterEach(() => (useNyttSaksbildeoppsett as Mock).mockReturnValue(false));

    function useAktivPeriodeMedValg() {
        return { aktivPeriode: useActivePeriod(person), velg: useSetActivePeriodIdUtenPerson() };
    }

    it('bruker den valgte perioden når den hører til sykefraværstilfellet', () => {
        mockRouter.setCurrentUrl(`/person/person-a/sykefravaerstilfelle/${vilkårsgrunnlagIdJanuar}`);
        const { result } = renderHook(() => useAktivPeriodeMedValg());

        act(() => result.current.velg(periodeIJanuar.id));

        expect(result.current.aktivPeriode?.id).toBe(periodeIJanuar.id);
    });

    it('velger en periode i sykefraværstilfellet når den valgte perioden hører til et annet', () => {
        mockRouter.setCurrentUrl(`/person/person-a/sykefravaerstilfelle/${vilkårsgrunnlagIdJanuar}`);
        const { result } = renderHook(() => useAktivPeriodeMedValg());

        act(() => result.current.velg(periodeIJuni.id));

        expect([periodeIJanuar.id, periodeIFebruar.id]).toContain(result.current.aktivPeriode?.id);
    });

    it('gir ingen aktiv periode når personen ikke har sykefraværstilfellet', () => {
        mockRouter.setCurrentUrl('/person/person-a/sykefravaerstilfelle/c7d29e4b-1a6f-4f02-8b3e-5e0a9d6c7f14');
        const { result } = renderHook(() => useAktivPeriodeMedValg());

        expect(result.current.aktivPeriode).toBeNull();
    });

    it('velger perioden i den eldre behandlingen når URL-en har et eldre grunnlag', () => {
        const vilkårsgrunnlagIdEldre = 'c7d29e4b-1a6f-4f02-8b3e-5e0a9d6c7f14';
        const periodeIEldreBehandling = enBeregnetPeriode({
            vedtaksperiodeId: periodeIJanuar.vedtaksperiodeId,
            fom: '2020-01-01',
            tom: '2020-01-31',
            vilkarsgrunnlagId: vilkårsgrunnlagIdEldre,
        });
        const personMedEldreBehandling = enPerson({
            arbeidsgivere: [
                enArbeidsgiver({
                    behandlinger: [
                        enBehandling({ perioder: [periodeIJuni, periodeIFebruar, periodeIJanuar] }),
                        enBehandling({ perioder: [periodeIEldreBehandling] }),
                    ],
                    ghostPerioder: [],
                }),
            ],
        });
        mockRouter.setCurrentUrl(`/person/person-a/sykefravaerstilfelle/${vilkårsgrunnlagIdEldre}`);

        const { result } = renderHook(() => useActivePeriod(personMedEldreBehandling));

        expect(result.current?.id).toBe(periodeIEldreBehandling.id);
    });
});

describe('useActivePeriod når Speil velger en periode i sykefraværstilfellet', () => {
    const vilkårsgrunnlagId = '5d2b8f0e-7a41-4c3e-9b6d-1f8e2a7c4b90';

    beforeEach(() => {
        (useNyttSaksbildeoppsett as Mock).mockReturnValue(true);
        mockRouter.setCurrentUrl(`/person/person-a/sykefravaerstilfelle/${vilkårsgrunnlagId}`);
    });
    afterEach(() => (useNyttSaksbildeoppsett as Mock).mockReturnValue(false));

    it('velger først en periode til behandling', () => {
        const utbetalt = enPeriodeITilfellet('2020-03-01', ApiPeriodetilstand.Utbetalt);
        const tilBehandling = enPeriodeITilfellet('2020-02-01', ApiPeriodetilstand.TilGodkjenning);
        const person = enPersonMedPerioder([utbetalt, tilBehandling]);

        const { result } = renderHook(() => useActivePeriod(person));

        expect(result.current?.id).toBe(tilBehandling.id);
    });

    it('velger en periode som venter når ingen er til behandling', () => {
        const utbetalt = enPeriodeITilfellet('2020-03-01', ApiPeriodetilstand.Utbetalt);
        const venter = enPeriodeITilfellet('2020-02-01', ApiPeriodetilstand.VenterPaEnAnnenPeriode);
        const person = enPersonMedPerioder([utbetalt, venter]);

        const { result } = renderHook(() => useActivePeriod(person));

        expect(result.current?.id).toBe(venter.id);
    });

    it('velger den nyeste perioden når ingen er til behandling eller venter', () => {
        const eldst = enPeriodeITilfellet('2020-01-01', ApiPeriodetilstand.Utbetalt);
        const nyest = enPeriodeITilfellet('2020-03-01', ApiPeriodetilstand.Utbetalt);
        const person = enPersonMedPerioder([eldst, nyest]);

        const { result } = renderHook(() => useActivePeriod(person));

        expect(result.current?.id).toBe(nyest.id);
    });

    it('velger etter samme prioritet når den valgte perioden hører til et annet sykefraværstilfelle', () => {
        const utbetalt = enPeriodeITilfellet('2020-03-01', ApiPeriodetilstand.Utbetalt);
        const tilBehandling = enPeriodeITilfellet('2020-02-01', ApiPeriodetilstand.TilGodkjenning);
        const iAnnetTilfelle = enBeregnetPeriode({
            fom: '2021-01-01',
            tom: '2021-01-31',
            vilkarsgrunnlagId: 'e1f4a9c2-3b7d-4d6e-8a05-6c2b9f1d7e34',
        });
        const person = enPersonMedPerioder([iAnnetTilfelle, utbetalt, tilBehandling]);
        const { result } = renderHook(() => ({
            aktivPeriode: useActivePeriod(person),
            velg: useSetActivePeriodIdUtenPerson(),
        }));

        act(() => result.current.velg(iAnnetTilfelle.id));

        expect(result.current.aktivPeriode?.id).toBe(tilBehandling.id);
    });

    it('velger ikke den gamle utgaven av en annullert periode', () => {
        const { person, ikkeAnnullert } = enPersonMedAnnullertVedtaksperiode();

        const { result } = renderHook(() => useActivePeriod(person));

        expect(result.current?.id).toBe(ikkeAnnullert.id);
    });

    it('velger den nyeste annullerte perioden når alle periodene i sykefraværstilfellet er annullert', () => {
        const annullertNyest = enBeregnetPeriode({
            fom: '2020-03-01',
            tom: '2020-03-28',
            periodetilstand: ApiPeriodetilstand.Annullert,
            vilkarsgrunnlagId: null,
        });
        const førAnnulleringen = enBeregnetPeriode({
            vedtaksperiodeId: annullertNyest.vedtaksperiodeId,
            fom: '2020-03-01',
            tom: '2020-03-28',
            vilkarsgrunnlagId: vilkårsgrunnlagId,
        });
        const person = enPerson({
            arbeidsgivere: [
                enArbeidsgiver({
                    behandlinger: [
                        enBehandling({ perioder: [annullertNyest] }),
                        enBehandling({ perioder: [førAnnulleringen] }),
                    ],
                    ghostPerioder: [],
                }),
            ],
        });

        const { result } = renderHook(() => useActivePeriod(person));

        expect(result.current?.id).toBe(annullertNyest.id);
    });

    it('beholder perioden Speil valgte når en refetch endrer tilstanden til periodene', () => {
        const utbetalt = enPeriodeITilfellet('2020-03-01', ApiPeriodetilstand.Utbetalt);
        const tilBehandling = enPeriodeITilfellet('2020-02-01', ApiPeriodetilstand.TilGodkjenning);
        const førRefetch = enPersonMedPerioder([utbetalt, tilBehandling]);
        const etterRefetch = enPersonMedPerioder([
            utbetalt,
            { ...tilBehandling, periodetilstand: ApiPeriodetilstand.Utbetalt },
        ]);
        const { result, rerender } = renderHook(
            ({ person }) => {
                const aktivPeriode = useActivePeriod(person);
                useSynkroniserValgtPeriodeMedUrl(aktivPeriode);
                return aktivPeriode;
            },
            { initialProps: { person: førRefetch } },
        );
        expect(result.current?.id).toBe(tilBehandling.id);

        rerender({ person: etterRefetch });

        expect(result.current?.id).toBe(tilBehandling.id);
    });

    function enPeriodeITilfellet(fom: string, periodetilstand: ApiPeriodetilstand) {
        return enBeregnetPeriode({
            fom,
            tom: fom.replace(/-01$/, '-28'),
            periodetilstand,
            vilkarsgrunnlagId: vilkårsgrunnlagId,
        });
    }

    function enPersonMedPerioder(perioder: ApiBeregnetPeriode[]) {
        return enPerson({
            arbeidsgivere: [enArbeidsgiver({ behandlinger: [enBehandling({ perioder })], ghostPerioder: [] })],
        });
    }

    function enPersonMedAnnullertVedtaksperiode() {
        const annullert = enBeregnetPeriode({
            fom: '2020-03-01',
            tom: '2020-03-28',
            periodetilstand: ApiPeriodetilstand.Annullert,
            vilkarsgrunnlagId: null,
        });
        const førAnnulleringen = enBeregnetPeriode({
            vedtaksperiodeId: annullert.vedtaksperiodeId,
            fom: '2020-03-01',
            tom: '2020-03-28',
            vilkarsgrunnlagId: vilkårsgrunnlagId,
        });
        const ikkeAnnullert = enPeriodeITilfellet('2020-01-01', ApiPeriodetilstand.Utbetalt);
        const person = enPerson({
            arbeidsgivere: [
                enArbeidsgiver({
                    behandlinger: [
                        enBehandling({ perioder: [annullert, ikkeAnnullert] }),
                        enBehandling({ perioder: [førAnnulleringen] }),
                    ],
                    ghostPerioder: [],
                }),
            ],
        });
        return { person, ikkeAnnullert };
    }
});

describe('useSelectPeriod', () => {
    const periode = enBeregnetPeriode();
    const person = enPerson({
        arbeidsgivere: [enArbeidsgiver({ behandlinger: [enBehandling({ perioder: [periode] })] })],
    });
    const periodeUrl = lagPeriodeUrl('person-a', periodeUrlIdFor(periode));

    function settNettleserUrl(url: string) {
        window.history.replaceState(null, '', url);
    }

    afterEach(() => {
        settNettleserUrl('/');
        vi.restoreAllMocks();
    });

    it('bruker fanen brukeren har valgt mens refetchen pågikk', () => {
        mockRouter.setCurrentUrl('/person/person-a#dagoversikt');
        const replace = vi.spyOn(mockRouter, 'replace');
        const { result } = renderHook(() => useSelectPeriod());

        settNettleserUrl('/person/person-a#sykepengegrunnlag');
        act(() => result.current(person));

        expect(replace).toHaveBeenCalledWith(`${periodeUrl}#sykepengegrunnlag`, undefined, { scroll: false });
    });

    it('overskriver ikke navigering til en underside mens refetchen pågikk', () => {
        mockRouter.setCurrentUrl('/person/person-a');
        const replace = vi.spyOn(mockRouter, 'replace');
        const { result } = renderHook(() => useSelectPeriod());

        settNettleserUrl('/person/person-a/tilkommen-inntekt');
        act(() => result.current(person));

        expect(replace).not.toHaveBeenCalled();
    });

    it('velger en periode i sykefraværstilfellet i URL-en når saksbehandler er i tabgruppen Sykefraværstilfellet', () => {
        (useNyttSaksbildeoppsett as Mock).mockReturnValue(true);
        const vilkårsgrunnlagId = '7f455614-5d21-4b3a-a4d5-af1df1a0ea96';
        const iTilfellet = enBeregnetPeriode({
            vilkarsgrunnlagId: vilkårsgrunnlagId,
            periodetilstand: ApiPeriodetilstand.Utbetalt,
        });
        const tilBehandlingIAnnetTilfelle = enBeregnetPeriode({
            vilkarsgrunnlagId: 'c6cd1daa-f584-49c0-809e-49304539551a',
            periodetilstand: ApiPeriodetilstand.TilGodkjenning,
        });
        const personMedToTilfeller = enPerson({
            arbeidsgivere: [
                enArbeidsgiver({
                    behandlinger: [enBehandling({ perioder: [tilBehandlingIAnnetTilfelle, iTilfellet] })],
                }),
            ],
        });
        const url = `/person/person-a/sykefravaerstilfelle/${vilkårsgrunnlagId}`;
        mockRouter.setCurrentUrl(url);
        settNettleserUrl(url);
        const replace = vi.spyOn(mockRouter, 'replace');
        const { result } = renderHook(() => ({
            velg: useSelectPeriod(),
            sistValgte: useSistValgtePeriode(personMedToTilfeller),
        }));

        act(() => result.current.velg(personMedToTilfeller));

        expect(result.current.sistValgte?.id).toBe(iTilfellet.id);
        expect(replace).not.toHaveBeenCalled();
        (useNyttSaksbildeoppsett as Mock).mockReturnValue(false);
    });
});

describe('erPåPeriodeside', () => {
    it('gjenkjenner saksbildet med og uten periode', () => {
        expect(erPåPeriodeside('/person/abc')).toBe(true);
        expect(erPåPeriodeside('/person/abc/periode/123')).toBe(true);
        expect(erPåPeriodeside('/person/abc/periode/123/behandling/456')).toBe(true);
        expect(erPåPeriodeside('/person/abc/periode/123/behandling')).toBe(false);
        expect(erPåPeriodeside('/person/abc/dialogmelding')).toBe(false);
        expect(erPåPeriodeside('/person/abc/tilkommeninntekt/1')).toBe(false);
        expect(erPåPeriodeside('/person/abc/leggtil')).toBe(false);
    });
});

describe('lagPeriodeUrl', () => {
    it('tar med behandling og fane når de finnes', () => {
        expect(lagPeriodeUrl('p', { periodeId: 'vp' })).toBe('/person/p/periode/vp');
        expect(lagPeriodeUrl('p', { periodeId: 'vp', behandlingId: 'b' }, 'dagoversikt')).toBe(
            '/person/p/periode/vp/behandling/b#dagoversikt',
        );
    });
});

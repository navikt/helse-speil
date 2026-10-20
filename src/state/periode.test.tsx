import mockRouter from 'next-router-mock';

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

        expect(replace).toHaveBeenCalledWith(`${periodeUrl}#sykepengegrunnlag`, { scroll: false });
    });

    it('overskriver ikke navigering til en underside mens refetchen pågikk', () => {
        mockRouter.setCurrentUrl('/person/person-a');
        const replace = vi.spyOn(mockRouter, 'replace');
        const { result } = renderHook(() => useSelectPeriod());

        settNettleserUrl('/person/person-a/tilkommen-inntekt');
        act(() => result.current(person));

        expect(replace).not.toHaveBeenCalled();
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

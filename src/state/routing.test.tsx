import mockRouter from 'next-router-mock';
import { Mock } from 'vitest';

import { ApiPeriodetilstand } from '@io/rest/generated/spesialist.schemas';
import { useActivePeriod, useSetActivePeriodIdUtenPerson } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { useNavigerTilTabgruppe, useNavigerTilValgtPeriode } from '@state/routing';
import { useNyttSaksbildeoppsett } from '@state/toggles';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enUberegnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { act, renderHook } from '@test-utils';

vi.mock('@state/person', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/person')>()),
    useFetchPersonQuery: vi.fn(),
}));

vi.mock('@state/toggles', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/toggles')>()),
    useNyttSaksbildeoppsett: vi.fn(),
}));

describe('useNavigerTilValgtPeriode i tabgruppen Sykefraværstilfellet', () => {
    const vilkårsgrunnlagIdNyeste = '3f1c2a8e-5b7d-4e9a-9c61-2d8f4b7a1e05';
    const vilkårsgrunnlagIdEldre = '8a4e6d21-0c3f-4b8e-a5d7-6f9b2c1e4d38';
    const vedtaksperiodeId = 'vedtaksperiode-1';
    const periodeINyesteBehandling = enBeregnetPeriode({
        vedtaksperiodeId,
        fom: '2020-01-01',
        tom: '2020-01-31',
        vilkarsgrunnlagId: vilkårsgrunnlagIdNyeste,
    });
    const periodeIEldreBehandling = enBeregnetPeriode({
        vedtaksperiodeId,
        fom: '2020-01-01',
        tom: '2020-01-31',
        vilkarsgrunnlagId: vilkårsgrunnlagIdEldre,
    });
    const uberegnetPeriode = enUberegnetPeriode({
        fom: '2020-03-01',
        tom: '2020-03-31',
        skjaeringstidspunkt: '2020-03-01',
    });
    const person = enPerson({
        arbeidsgivere: [
            enArbeidsgiver({
                behandlinger: [
                    enBehandling({ perioder: [uberegnetPeriode, periodeINyesteBehandling] }),
                    enBehandling({ perioder: [periodeIEldreBehandling] }),
                ],
                ghostPerioder: [],
            }),
        ],
    });

    beforeEach(() => {
        sessionStorage.clear();
        (useNyttSaksbildeoppsett as Mock).mockReturnValue(true);
        (useFetchPersonQuery as Mock).mockReturnValue({ data: person });
        gåTil('/person/person-a/sykefravaerstilfelle/2020-01-01#sykepengegrunnlag');
    });

    it('viser det nyeste grunnlaget for skjæringstidspunktet når ingen periode er valgt', () => {
        const { result } = renderHook(() => useNavigeringOgAktivPeriode());

        expect(result.current.aktivPeriode?.id).toBe(periodeINyesteBehandling.id);
    });

    it('beholder URL-en og taben og viser det eldre grunnlaget når saksbehandler velger en periode i en eldre behandling', () => {
        const { result, rerender } = renderHook(() => useNavigeringOgAktivPeriode());

        act(() => result.current.naviger(periodeIEldreBehandling.id));
        rerender();

        expect(mockRouter.asPath).toBe('/person/person-a/sykefravaerstilfelle/2020-01-01#sykepengegrunnlag');
        expect(result.current.aktivPeriode?.id).toBe(periodeIEldreBehandling.id);
        expect(result.current.aktivPeriode).toMatchObject({ vilkarsgrunnlagId: vilkårsgrunnlagIdEldre });
    });

    it('går til sykefraværstilfellet til en uberegnet periode og beholder taben', () => {
        const { result, rerender } = renderHook(() => useNavigeringOgAktivPeriode());

        act(() => result.current.naviger(uberegnetPeriode.id));
        rerender();

        expect(mockRouter.asPath).toBe('/person/person-a/sykefravaerstilfelle/2020-03-01#sykepengegrunnlag');
        expect(result.current.aktivPeriode?.id).toBe(uberegnetPeriode.id);
    });

    it('går til periode-URL-en når det nye saksbildeoppsettet er av', () => {
        (useNyttSaksbildeoppsett as Mock).mockReturnValue(false);
        const { result } = renderHook(() => useNavigeringOgAktivPeriode());

        act(() => result.current.naviger(periodeIEldreBehandling.id));

        expect(mockRouter.asPath).toBe(
            `/person/person-a/periode/${vedtaksperiodeId}/behandling/${periodeIEldreBehandling.behandlingId}#sykepengegrunnlag`,
        );
    });

    function useNavigeringOgAktivPeriode() {
        return { naviger: useNavigerTilValgtPeriode(), aktivPeriode: useActivePeriod(person) };
    }
});

describe('useNavigerTilTabgruppe fra tabgruppen Sykefraværstilfellet', () => {
    const vilkårsgrunnlagId = '3f1c2a8e-5b7d-4e9a-9c61-2d8f4b7a1e05';
    const tilBehandling = enBeregnetPeriode({
        fom: '2020-02-01',
        tom: '2020-02-28',
        periodetilstand: ApiPeriodetilstand.TilGodkjenning,
        vilkarsgrunnlagId: vilkårsgrunnlagId,
    });
    const valgtPeriode = enBeregnetPeriode({
        fom: '2020-01-01',
        tom: '2020-01-31',
        vilkarsgrunnlagId: vilkårsgrunnlagId,
    });
    const person = enPerson({
        arbeidsgivere: [
            enArbeidsgiver({
                behandlinger: [enBehandling({ perioder: [tilBehandling, valgtPeriode] })],
                ghostPerioder: [],
            }),
        ],
    });

    beforeEach(() => {
        sessionStorage.clear();
        (useNyttSaksbildeoppsett as Mock).mockReturnValue(true);
        (useFetchPersonQuery as Mock).mockReturnValue({ data: person });
        gåTil('/person/person-a/sykefravaerstilfelle/2020-01-01#sykepengegrunnlag');
    });

    it('kommer tilbake til den samme perioden i tabgruppen Periode', () => {
        const { result, rerender } = renderHook(() => ({
            aktivPeriode: useActivePeriod(person),
            velg: useSetActivePeriodIdUtenPerson(),
            navigerTilTabgruppe: useNavigerTilTabgruppe(),
        }));
        act(() => result.current.velg(valgtPeriode.id));

        act(() => result.current.navigerTilTabgruppe(result.current.aktivPeriode!, 'dagoversikt'));
        rerender();

        expect(mockRouter.asPath).toBe(
            `/person/person-a/periode/${valgtPeriode.vedtaksperiodeId}/behandling/${valgtPeriode.behandlingId}#dagoversikt`,
        );
        expect(result.current.aktivPeriode?.id).toBe(valgtPeriode.id);
    });
});

describe('useNavigerTilTabgruppe fra tabgruppen Periode', () => {
    const uberegnetPeriode = enUberegnetPeriode({ skjaeringstidspunkt: '2020-03-01' });
    const person = enPerson({
        arbeidsgivere: [
            enArbeidsgiver({ behandlinger: [enBehandling({ perioder: [uberegnetPeriode] })], ghostPerioder: [] }),
        ],
    });

    beforeEach(() => {
        sessionStorage.clear();
        (useNyttSaksbildeoppsett as Mock).mockReturnValue(true);
        (useFetchPersonQuery as Mock).mockReturnValue({ data: person });
        gåTil(
            `/person/person-a/periode/${uberegnetPeriode.vedtaksperiodeId}/behandling/${uberegnetPeriode.behandlingId}#dagoversikt`,
        );
    });

    it('går til sykefraværstilfellet når ingen perioder med skjæringstidspunktet er beregnet', () => {
        const { result } = renderHook(() => useNavigerTilTabgruppe());

        act(() => result.current(uberegnetPeriode, 'sykepengegrunnlag'));

        expect(mockRouter.asPath).toBe('/person/person-a/sykefravaerstilfelle/2020-03-01#sykepengegrunnlag');
    });
});

function gåTil(url: string) {
    mockRouter.setCurrentUrl(url);
    window.history.replaceState(null, '', url);
}

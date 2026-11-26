import mockRouter from 'next-router-mock';
import { Mock } from 'vitest';

import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { useNavigerTilValgtPeriode } from '@state/routing';
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

describe('useNavigerTilValgtPeriode i Sykefraværstilfellet-delen', () => {
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
    const uberegnetPeriode = enUberegnetPeriode({ fom: '2020-03-01', tom: '2020-03-31' });
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
        gåTil(`/person/person-a/sykefravaerstilfelle/${vilkårsgrunnlagIdNyeste}#sykepengegrunnlag`);
    });

    it('går til URL-en for det eldre grunnlaget og beholder fanen når saksbehandler velger en periode i en eldre behandling', () => {
        const { result, rerender } = renderHook(() => useNavigeringOgAktivPeriode());

        act(() => result.current.naviger(periodeIEldreBehandling.id));
        rerender();

        expect(mockRouter.asPath).toBe(
            `/person/person-a/sykefravaerstilfelle/${vilkårsgrunnlagIdEldre}#sykepengegrunnlag`,
        );
        expect(result.current.aktivPeriode?.id).toBe(periodeIEldreBehandling.id);
    });

    it('går til periode-URL-en når perioden ikke har et vilkårsgrunnlag', () => {
        const { result } = renderHook(() => useNavigeringOgAktivPeriode());

        act(() => result.current.naviger(uberegnetPeriode.id));

        expect(mockRouter.asPath).toBe(
            `/person/person-a/periode/${uberegnetPeriode.vedtaksperiodeId}/behandling/${uberegnetPeriode.behandlingId}#sykepengegrunnlag`,
        );
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

function gåTil(url: string) {
    mockRouter.setCurrentUrl(url);
    window.history.replaceState(null, '', url);
}

import mockRouter from 'next-router-mock';
import { Mock } from 'vitest';

import { useNyttSaksbildeoppsett } from '@state/toggles';
import { act, renderHook } from '@test-utils';

import { ankerTilTab, useLagreTabFraAnker, useNullstillSaksbildeTab, useSaksbildeTab } from './tab';

vi.mock('@state/toggles', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/toggles')>()),
    useNyttSaksbildeoppsett: vi.fn(() => false),
}));

function useTabOgNullstill() {
    const [tab, setTab] = useSaksbildeTab();
    const nullstill = useNullstillSaksbildeTab();
    return { tab, setTab, nullstill };
}

describe('useSaksbildeTab', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    it('åpner på Dagoversikt når man bytter til en annen person', () => {
        mockRouter.setCurrentUrl('/person/person-a');
        const { result, rerender } = renderHook(() => useSaksbildeTab());

        act(() => result.current[1]('sykepengegrunnlag'));
        expect(result.current[0]).toBe('sykepengegrunnlag');

        act(() => mockRouter.setCurrentUrl('/person/person-b'));
        rerender();

        expect(result.current[0]).toBe('dagoversikt');
    });

    it('åpner på Dagoversikt ved A → B → A når fanen nullstilles ved personbytte', () => {
        mockRouter.setCurrentUrl('/person/person-a');
        const { result, rerender } = renderHook(() => useTabOgNullstill());

        act(() => result.current.setTab('sykepengegrunnlag'));

        act(() => {
            result.current.nullstill();
            mockRouter.setCurrentUrl('/person/person-b');
        });
        rerender();
        expect(result.current.tab).toBe('dagoversikt');

        act(() => {
            result.current.nullstill();
            mockRouter.setCurrentUrl('/person/person-a');
        });
        rerender();
        expect(result.current.tab).toBe('dagoversikt');
    });

    it('beholder fanen for samme person etter refresh, også via en underside', () => {
        mockRouter.setCurrentUrl('/person/person-a');
        const førRefresh = renderHook(() => useSaksbildeTab());
        act(() => førRefresh.result.current[1]('inngangsvilkår'));
        førRefresh.unmount();

        mockRouter.setCurrentUrl('/person/person-a/tilkommen-inntekt');
        const etterRefresh = renderHook(() => useSaksbildeTab());
        expect(etterRefresh.result.current[0]).toBe('inngangsvilkår');

        act(() => mockRouter.setCurrentUrl('/person/person-a'));
        etterRefresh.rerender();
        expect(etterRefresh.result.current[0]).toBe('inngangsvilkår');
    });
});

describe('saksbildefane i URL-anker', () => {
    beforeEach(() => {
        sessionStorage.clear();
        window.history.replaceState(null, '', '/');
    });

    it('leser fanen fra ankeret på periodesiden', () => {
        mockRouter.setCurrentUrl('/person/person-a/periode/vedtaksperiode-1');
        window.history.replaceState(null, '', '/person/person-a/periode/vedtaksperiode-1#inngangsvilkar');

        const { result } = renderHook(() => useSaksbildeTab());

        expect(result.current[0]).toBe('inngangsvilkår');
    });

    it('oppdaterer ankeret når fanen byttes', () => {
        mockRouter.setCurrentUrl('/person/person-a/periode/vedtaksperiode-1');
        window.history.replaceState(null, '', '/person/person-a/periode/vedtaksperiode-1');

        const { result } = renderHook(() => useSaksbildeTab());
        act(() => result.current[1]('sykepengegrunnlag'));

        expect(window.location.hash).toBe('#sykepengegrunnlag');
        expect(result.current[0]).toBe('sykepengegrunnlag');
    });

    it('følger ankeret ved navigering i historikken', () => {
        mockRouter.setCurrentUrl('/person/person-a/periode/vedtaksperiode-1');
        window.history.replaceState(null, '', '/person/person-a/periode/vedtaksperiode-1#dagoversikt');

        const { result } = renderHook(() => useSaksbildeTab());
        act(() => {
            window.location.hash = '#vurderingsmomenter';
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        });

        expect(result.current[0]).toBe('vurderingsmomenter');
    });

    it('husker fanen fra ankeret etter navigering i historikken når man går tilbake til personen', () => {
        mockRouter.setCurrentUrl('/person/person-a/periode/vedtaksperiode-1');
        window.history.replaceState(null, '', '/person/person-a/periode/vedtaksperiode-1#inngangsvilkar');

        const { result, rerender } = renderHook(() => {
            useLagreTabFraAnker();
            return useSaksbildeTab();
        });
        act(() => {
            window.location.hash = '#sykepengegrunnlag';
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
        expect(result.current[0]).toBe('sykepengegrunnlag');

        act(() => {
            mockRouter.setCurrentUrl('/person/person-a');
            window.history.replaceState(null, '', '/person/person-a');
            window.dispatchEvent(new PopStateEvent('popstate'));
        });
        rerender();
        expect(result.current[0]).toBe('sykepengegrunnlag');
    });

    it('setter ikke anker utenfor periodesiden', () => {
        mockRouter.setCurrentUrl('/person/person-a/dialogmelding');
        window.history.replaceState(null, '', '/person/person-a/dialogmelding');

        const { result } = renderHook(() => useSaksbildeTab());
        act(() => result.current[1]('sykepengegrunnlag'));

        expect(window.location.hash).toBe('');
    });
});

describe('ankerTilTab', () => {
    it('godtar både ASCII-anker og prosentkodet fanenavn', () => {
        expect(ankerTilTab('#inngangsvilkar')).toBe('inngangsvilkår');
        expect(ankerTilTab('#inngangsvilk%C3%A5r')).toBe('inngangsvilkår');
        expect(ankerTilTab('#ukjent')).toBeNull();
        expect(ankerTilTab('')).toBeNull();
    });
});

describe('saksbildetab med det nye saksbildeoppsettet', () => {
    const sykefraværstilfelleUrl = '/person/person-a/sykefravaerstilfelle/3f1c2a8e-5b7d-4e9a-9c61-2d8f4b7a1e05';

    function gåTil(url: string) {
        mockRouter.setCurrentUrl(url);
        window.history.replaceState(null, '', url);
    }

    beforeEach(() => {
        sessionStorage.clear();
        (useNyttSaksbildeoppsett as Mock).mockReturnValue(true);
    });

    afterEach(() => {
        (useNyttSaksbildeoppsett as Mock).mockReturnValue(false);
        window.history.replaceState(null, '', '/');
    });

    it('åpner på Sykepengegrunnlag i tabgruppen Sykefraværstilfellet uten lagret tab', () => {
        gåTil(sykefraværstilfelleUrl);
        const { result } = renderHook(() => useSaksbildeTab());

        expect(result.current[0]).toBe('sykepengegrunnlag');
    });

    it('åpner ikke en tab fra den andre tabgruppen', () => {
        gåTil('/person/person-a/periode/vedtaksperiode-1');
        const { result, rerender } = renderHook(() => useSaksbildeTab());
        act(() => result.current[1]('dagoversikt'));

        act(() => gåTil(sykefraværstilfelleUrl));
        rerender();
        expect(result.current[0]).toBe('sykepengegrunnlag');

        act(() => result.current[1]('inngangsvilkår'));
        act(() => gåTil('/person/person-a/periode/vedtaksperiode-1'));
        rerender();
        expect(result.current[0]).toBe('dagoversikt');
    });

    it('husker den siste taben i hver tabgruppe for personen', () => {
        gåTil('/person/person-a/periode/vedtaksperiode-1');
        const { result, rerender } = renderHook(() => useSaksbildeTab());
        act(() => result.current[1]('vurderingsmomenter'));

        act(() => gåTil(sykefraværstilfelleUrl));
        rerender();
        act(() => result.current[1]('inngangsvilkår'));

        act(() => gåTil('/person/person-a/periode/vedtaksperiode-1'));
        rerender();
        expect(result.current[0]).toBe('vurderingsmomenter');

        act(() => gåTil(sykefraværstilfelleUrl));
        rerender();
        expect(result.current[0]).toBe('inngangsvilkår');
    });

    it('beholder en tab som er lagret før Speil husket taben i hver tabgruppe', () => {
        sessionStorage.setItem(
            'saksbildeTabPerPerson',
            JSON.stringify({ personPseudoId: 'person-a', tab: 'inngangsvilkår' }),
        );
        gåTil('/person/person-a/periode/vedtaksperiode-1');
        const { result, rerender } = renderHook(() => useSaksbildeTab());
        act(() => result.current[1]('vurderingsmomenter'));

        act(() => gåTil(sykefraværstilfelleUrl));
        rerender();

        expect(result.current[0]).toBe('inngangsvilkår');
    });

    it('leser og setter ankeret på siden for sykefraværstilfellet', () => {
        gåTil(`${sykefraværstilfelleUrl}#inngangsvilkar`);
        const { result } = renderHook(() => useSaksbildeTab());
        expect(result.current[0]).toBe('inngangsvilkår');

        act(() => result.current[1]('sykepengegrunnlag'));
        expect(window.location.hash).toBe('#sykepengegrunnlag');
        expect(result.current[0]).toBe('sykepengegrunnlag');
    });
});

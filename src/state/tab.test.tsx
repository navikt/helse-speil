import mockRouter from 'next-router-mock';

import { act, renderHook } from '@test-utils';

import { useNullstillSaksbildeTab, useSaksbildeTab } from './tab';

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

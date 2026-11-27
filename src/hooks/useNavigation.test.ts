import mockRouter from 'next-router-mock';
import { Mock } from 'vitest';

import { useNavigation } from '@hooks/useNavigation';
import { useSaksbildeTab } from '@state/tab';
import { useNyttSaksbildeoppsett } from '@state/toggles';
import { act, renderHook } from '@test-utils';

vi.mock('@state/toggles', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/toggles')>()),
    useNyttSaksbildeoppsett: vi.fn(),
}));

function useNavigasjonOgTab() {
    return { navigasjon: useNavigation(), tab: useSaksbildeTab()[0] };
}

describe('useNavigation med det nye saksbildeoppsettet', () => {
    beforeEach(() => {
        sessionStorage.clear();
        (useNyttSaksbildeoppsett as Mock).mockReturnValue(true);
        const url = '/person/person-a/sykefravaerstilfelle/2020-01-01#sykepengegrunnlag';
        mockRouter.setCurrentUrl(url);
        window.history.replaceState(null, '', url);
    });

    it('går mellom tabene i tabgruppen Sykefraværstilfellet i samme rekkefølge som tabene vises', () => {
        const { result } = renderHook(() => useNavigasjonOgTab());

        act(() => result.current.navigasjon.navigateToNext());
        expect(result.current.tab).toBe('inngangsvilkår');

        act(() => result.current.navigasjon.navigateToNext());
        expect(result.current.tab).toBe('inngangsvilkår');

        act(() => result.current.navigasjon.navigateToPrevious());
        expect(result.current.tab).toBe('sykepengegrunnlag');
    });

    it('går fra Vurderingsmomenter til Utvikler i tabgruppen Periode, som er siste tab', () => {
        const url = '/person/person-a/periode/periode-1#vurderingsmomenter';
        mockRouter.setCurrentUrl(url);
        window.history.replaceState(null, '', url);
        const { result } = renderHook(() => useNavigasjonOgTab());

        act(() => result.current.navigasjon.navigateToNext());
        expect(result.current.tab).toBe('utvikler');

        act(() => result.current.navigasjon.navigateToNext());
        expect(result.current.tab).toBe('utvikler');
    });
});

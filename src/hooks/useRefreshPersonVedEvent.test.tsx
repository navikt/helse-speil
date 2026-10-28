import { Mock, vi } from 'vitest';

import { ApiServerSentEvent, ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { useSelectPeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useToasts } from '@state/toasts';
import { QueryClient } from '@tanstack/react-query';
import { act, renderHook } from '@test-utils';

import { useRefreshPersonVedEvent } from './useRefreshPersonVedEvent';

vi.mock('@state/person', async () => ({
    ...(await vi.importActual('@state/person')),
    useFetchPersonQuery: vi.fn(),
}));
vi.mock('@state/periode');
vi.mock('@state/toasts');
vi.mock('@state/serverSentEvents', async () => ({
    ...(await vi.importActual('@state/serverSentEvents')),
    useHåndterNyttEvent: vi.fn(),
}));

describe('useRefreshPersonVedEvent', () => {
    let håndterEvent: (event: ApiServerSentEvent) => Promise<void>;
    const addToast = vi.fn();
    const selectPeriod = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(QueryClient.prototype, 'invalidateQueries').mockResolvedValue();
        (useFetchPersonQuery as Mock).mockReturnValue({ data: {} });
        (useSelectPeriod as Mock).mockReturnValue(selectPeriod);
        (useAddToast as Mock).mockReturnValue(addToast);
        (useToasts as Mock).mockReturnValue([]);
        (useHåndterNyttEvent as Mock).mockImplementation((onNyttEvent) => {
            håndterEvent = onNyttEvent;
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('slår sammen hendelser under pågående refetch til én ekstra refetch', async () => {
        const ferdig: (() => void)[] = [];
        const refetch = vi
            .spyOn(QueryClient.prototype, 'refetchQueries')
            .mockImplementation(() => new Promise<void>((resolve) => ferdig.push(resolve)));
        renderHook(() => useRefreshPersonVedEvent());

        let første!: Promise<void>;
        await act(async () => {
            første = håndterEvent(event(ApiServerSentEventEvent.PERSONDATA_OPPDATERT));
            await håndterEvent(event(ApiServerSentEventEvent.PERSONDATA_OPPDATERT));
            await håndterEvent(event(ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE));
        });
        expect(refetch).toHaveBeenCalledTimes(1);

        await act(async () => {
            ferdig[0]!();
            await vi.waitFor(() => expect(refetch).toHaveBeenCalledTimes(2));
            ferdig[1]!();
            await første;
        });

        expect(refetch).toHaveBeenCalledTimes(2);
        expect(addToast).toHaveBeenCalledTimes(1);
    });

    test('viser ikke toast for hendelser som ikke gjelder ny oppgave', async () => {
        const refetch = vi.spyOn(QueryClient.prototype, 'refetchQueries').mockResolvedValue();
        renderHook(() => useRefreshPersonVedEvent());

        await act(() => håndterEvent(event(ApiServerSentEventEvent.PERSONDATA_OPPDATERT)));

        expect(refetch).toHaveBeenCalledTimes(1);
        expect(addToast).not.toHaveBeenCalled();
    });
});

function event(type: ApiServerSentEventEvent): ApiServerSentEvent {
    return { event: type, data: null };
}

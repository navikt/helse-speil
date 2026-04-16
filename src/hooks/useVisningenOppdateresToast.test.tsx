import { act } from 'react';
import { Mock, vi } from 'vitest';

import { visningenOppdateresToastKey } from '@state/oppdateringToasts';
import { useRemoveToast } from '@state/toasts';
import { renderHook } from '@testing-library/react';

import { useFjernOppdatererToast } from './useFjernOppdatererToast';

vi.mock('@state/toasts', () => ({
    useRemoveToast: vi.fn(),
}));

describe('useFjernOppdateringToast', () => {
    const removeToastMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        (useRemoveToast as Mock).mockReturnValue(removeToastMock);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('skal kalle setHasTimedOut etter 15 sekunder når calculating er true', () => {
        const setHasTimedOut = vi.fn();

        renderHook(() => useFjernOppdatererToast(true, setHasTimedOut));

        expect(setHasTimedOut).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(15000);
        });

        expect(setHasTimedOut).toHaveBeenCalledTimes(1);
    });

    it('skal not kalle setHasTimedOut når calculating er false', () => {
        const setHasTimedOut = vi.fn();

        renderHook(() => useFjernOppdatererToast(false, setHasTimedOut));

        act(() => {
            vi.advanceTimersByTime(15000);
        });

        expect(setHasTimedOut).not.toHaveBeenCalled();
    });

    it('skal kalle removeToast med visningenOppdateresToastKey når calculating endrer fra true til false', () => {
        const setHasTimedOut = vi.fn();

        const { rerender } = renderHook(
            ({ visningenOppdateres }) => useFjernOppdatererToast(visningenOppdateres, setHasTimedOut),
            {
                initialProps: { visningenOppdateres: true },
            },
        );

        expect(removeToastMock).not.toHaveBeenCalled();

        rerender({ visningenOppdateres: false });

        expect(removeToastMock).toHaveBeenCalledWith(visningenOppdateresToastKey);
    });

    it('skal fjerne timeout når calculating endrer fra true til false før timeout kjører', () => {
        const setHasTimedOut = vi.fn();

        const { rerender } = renderHook(
            ({ visningenOppdateres }) => useFjernOppdatererToast(visningenOppdateres, setHasTimedOut),
            {
                initialProps: { visningenOppdateres: true },
            },
        );

        act(() => {
            vi.advanceTimersByTime(10000);
        });

        rerender({ visningenOppdateres: false });

        act(() => {
            vi.advanceTimersByTime(10000);
        });

        expect(setHasTimedOut).not.toHaveBeenCalled();
    });

    it('skal use the latest setHasTimedOut callback', () => {
        const setHasTimedOut1 = vi.fn();
        const setHasTimedOut2 = vi.fn();

        const { rerender } = renderHook(({ setHasTimedOut }) => useFjernOppdatererToast(true, setHasTimedOut), {
            initialProps: { setHasTimedOut: setHasTimedOut1 },
        });

        act(() => {
            vi.advanceTimersByTime(7000);
        });

        rerender({ setHasTimedOut: setHasTimedOut2 });

        act(() => {
            vi.advanceTimersByTime(8000);
        });

        expect(setHasTimedOut1).not.toHaveBeenCalled();
        expect(setHasTimedOut2).toHaveBeenCalledTimes(1);
    });
});

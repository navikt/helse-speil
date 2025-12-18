import { act } from 'react';
import { Mock, vi } from 'vitest';

import { kalkulererToastKey } from '@state/kalkuleringstoasts';
import { useRemoveToast } from '@state/toasts';
import { renderHook } from '@testing-library/react';

import { useFjernKalkulerToast } from './useFjernKalkulererToast';

vi.mock('@state/toasts', () => ({
    useRemoveToast: vi.fn(),
}));

describe('useFjernKalkulerToast', () => {
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

        renderHook(() => useFjernKalkulerToast(true, setHasTimedOut));

        expect(setHasTimedOut).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(15000);
        });

        expect(setHasTimedOut).toHaveBeenCalledTimes(1);
    });

    it('skal not kalle setHasTimedOut når calculating er false', () => {
        const setHasTimedOut = vi.fn();

        renderHook(() => useFjernKalkulerToast(false, setHasTimedOut));

        act(() => {
            vi.advanceTimersByTime(15000);
        });

        expect(setHasTimedOut).not.toHaveBeenCalled();
    });

    it('skal kalle removeToast med kalkulererToastKey når calculating endrer fra true til false', () => {
        const setHasTimedOut = vi.fn();

        const { rerender } = renderHook(({ calculating }) => useFjernKalkulerToast(calculating, setHasTimedOut), {
            initialProps: { calculating: true },
        });

        expect(removeToastMock).not.toHaveBeenCalled();

        rerender({ calculating: false });

        expect(removeToastMock).toHaveBeenCalledWith(kalkulererToastKey);
    });

    it('skal fjerne timeout når calculating endrer fra true til false før timeout kjører', () => {
        const setHasTimedOut = vi.fn();

        const { rerender } = renderHook(({ calculating }) => useFjernKalkulerToast(calculating, setHasTimedOut), {
            initialProps: { calculating: true },
        });

        act(() => {
            vi.advanceTimersByTime(10000);
        });

        rerender({ calculating: false });

        act(() => {
            vi.advanceTimersByTime(10000);
        });

        expect(setHasTimedOut).not.toHaveBeenCalled();
    });

    it('skal use the latest setHasTimedOut callback', () => {
        const setHasTimedOut1 = vi.fn();
        const setHasTimedOut2 = vi.fn();

        const { rerender } = renderHook(({ setHasTimedOut }) => useFjernKalkulerToast(true, setHasTimedOut), {
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

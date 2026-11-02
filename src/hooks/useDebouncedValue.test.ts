import { act, renderHook } from '@test-utils';

import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returnerer første verdi med en gang', () => {
        const { result } = renderHook(() => useDebouncedValue('a', 300));

        expect(result.current).toBe('a');
    });

    it('oppdaterer verdien først etter ventetiden', () => {
        const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
            initialProps: { value: 'a' },
        });

        rerender({ value: 'b' });
        act(() => vi.advanceTimersByTime(299));
        expect(result.current).toBe('a');

        act(() => vi.advanceTimersByTime(1));
        expect(result.current).toBe('b');
    });

    it('starter ventetiden på nytt ved hver endring', () => {
        const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
            initialProps: { value: 'a' },
        });

        rerender({ value: 'b' });
        act(() => vi.advanceTimersByTime(200));
        rerender({ value: 'c' });
        act(() => vi.advanceTimersByTime(200));
        expect(result.current).toBe('a');

        act(() => vi.advanceTimersByTime(100));
        expect(result.current).toBe('c');
    });
});

import React from 'react';

import { renderHook, waitFor } from '@testing-library/react';

import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
    test('returnerer false før timeout, true etter timeout', () => {
        let trigger = false;
        const { result, rerender } = renderHook(() => useDebounce(trigger, 0));
        expect(result.current).toBeFalsy();

        trigger = true;
        rerender();

        expect(result.current).toBeFalsy();
        waitFor(() => expect(result.current).toBeTruthy());
    });
});

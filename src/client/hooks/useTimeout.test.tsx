import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import { useTimeout } from './useTimeout';
import { waitFor } from '@testing-library/react';
import { sleep } from '../../server/devHelpers';

describe('useTimeout', () => {
    test('kaller callback etter timeout', async () => {
        let hasBeenCalled = false;
        renderHook(() =>
            useTimeout({
                callback: () => {
                    hasBeenCalled = true;
                },
                timeout: 0,
                trigger: true,
            })
        );
        expect(hasBeenCalled).toBeFalsy();
        await waitFor(() => {
            expect(hasBeenCalled).toBeTruthy();
        });
    });
    test('kaller ikke callback etter timeout hvis trigger er false', async () => {
        let hasBeenCalled = false;
        renderHook(() =>
            useTimeout({
                callback: () => {
                    hasBeenCalled = true;
                },
                timeout: 0,
                trigger: false,
            })
        );
        expect(hasBeenCalled).toBeFalsy();
        await sleep(0);
        expect(hasBeenCalled).toBeFalsy();
    });
});

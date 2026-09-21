import { beforeEach, describe, expect, it } from 'vitest';

import { act, renderHook } from '@test-utils';

import { useIsAnonymous, useToggleAnonymity } from './anonymization';

const renderAnonymiseringHooks = () =>
    renderHook(() => ({
        isAnonymous: useIsAnonymous(),
        toggle: useToggleAnonymity(),
    }));

describe('anonymisering', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('er av som standard', () => {
        const { result } = renderAnonymiseringHooks();

        expect(result.current.isAnonymous).toBe(false);
    });

    it('leser lagret verdi ved første render', () => {
        localStorage.setItem('anonymisering', 'true');

        const { result } = renderAnonymiseringHooks();

        expect(result.current.isAnonymous).toBe(true);
    });

    it('skrur på anonymisering og lagrer den', () => {
        const { result } = renderAnonymiseringHooks();

        act(() => result.current.toggle());

        expect(result.current.isAnonymous).toBe(true);
        expect(localStorage.getItem('anonymisering')).toBe('true');
    });

    it('skrur av anonymisering igjen', () => {
        localStorage.setItem('anonymisering', 'true');
        const { result } = renderAnonymiseringHooks();

        act(() => result.current.toggle());

        expect(result.current.isAnonymous).toBe(false);
        expect(localStorage.getItem('anonymisering')).toBe('false');
    });

    it('beholder anonymiseringen etter remount, slik refresh gjør', () => {
        const { result, unmount } = renderAnonymiseringHooks();
        act(() => result.current.toggle());
        unmount();

        const { result: etterRefresh } = renderAnonymiseringHooks();

        expect(etterRefresh.current.isAnonymous).toBe(true);
    });

    it('oppdaterer seg når en annen fane endrer verdien', () => {
        const { result } = renderAnonymiseringHooks();

        act(() => {
            localStorage.setItem('anonymisering', 'true');
            window.dispatchEvent(new Event('storage'));
        });

        expect(result.current.isAnonymous).toBe(true);
    });
});

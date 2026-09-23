import { beforeEach, describe, expect, it } from 'vitest';

import { act, renderHook } from '@test-utils';
import { renderHook as renderHookUtenProvidere } from '@testing-library/react';

import { useAnonymizationContext } from './context';

const renderAnonymisering = () => renderHook(() => useAnonymizationContext());

describe('AnonymizationProvider', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('er av som standard', () => {
        const { result } = renderAnonymisering();

        expect(result.current.isAnonymized).toBe(false);
    });

    it('leser lagret verdi ved første render', () => {
        localStorage.setItem('anonymisering', 'true');

        const { result } = renderAnonymisering();

        expect(result.current.isAnonymized).toBe(true);
    });

    it('skrur på anonymisering og lagrer den', () => {
        const { result } = renderAnonymisering();

        act(() => result.current.toggle());

        expect(result.current.isAnonymized).toBe(true);
        expect(localStorage.getItem('anonymisering')).toBe('true');
    });

    it('skrur av anonymisering igjen', () => {
        localStorage.setItem('anonymisering', 'true');
        const { result } = renderAnonymisering();

        act(() => result.current.toggle());

        expect(result.current.isAnonymized).toBe(false);
        expect(localStorage.getItem('anonymisering')).toBe('false');
    });

    it('beholder anonymiseringen etter remount, slik refresh gjør', () => {
        const { result, unmount } = renderAnonymisering();
        act(() => result.current.toggle());
        unmount();

        const { result: etterRefresh } = renderAnonymisering();

        expect(etterRefresh.current.isAnonymized).toBe(true);
    });

    it('oppdaterer seg når en annen fane endrer verdien', () => {
        const { result } = renderAnonymisering();

        act(() => {
            localStorage.setItem('anonymisering', 'true');
            window.dispatchEvent(new Event('storage'));
        });

        expect(result.current.isAnonymized).toBe(true);
    });

    it('setter anonymized-klassen på <html> så portaler også sladdes', () => {
        const { result, unmount } = renderAnonymisering();
        expect(document.documentElement).not.toHaveClass('anonymized');

        act(() => result.current.toggle());
        expect(document.documentElement).toHaveClass('anonymized');

        act(() => result.current.toggle());
        expect(document.documentElement).not.toHaveClass('anonymized');

        act(() => result.current.toggle());
        unmount();
        expect(document.documentElement).not.toHaveClass('anonymized');
    });

    it('kaster feil når konteksten brukes uten provider', () => {
        expect(() => renderHookUtenProvidere(() => useAnonymizationContext())).toThrow(
            'useAnonymizationContext må brukes inne i en AnonymizationProvider',
        );
    });
});

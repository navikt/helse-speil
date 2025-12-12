import React from 'react';
import { vi } from 'vitest';

import { render } from '@test-utils';
import { screen } from '@testing-library/react';

import { ErrorBoundary } from './ErrorBoundary';

const swallowErrorsInJsDom = () => {
    window.addEventListener('error', (event: Event) => event.preventDefault());
};

swallowErrorsInJsDom();

const ThrowsError = () => {
    throw Error('Dette er en error');
};

describe('ErrorBoundary', () => {
    test('fanger exceptions og rendrer fallback (ReactNode)', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(
            <ErrorBoundary fallback={<span>Dette er en fallback</span>}>
                <ThrowsError />
            </ErrorBoundary>,
        );
        expect(screen.getByText('Dette er en fallback')).toBeVisible();
        consoleErrorSpy.mockRestore();
    });
    test('fanger exceptions og rendrer fallback (function)', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(
            <ErrorBoundary fallback={(error) => <span>{error.message}</span>}>
                <ThrowsError />
            </ErrorBoundary>,
        );
        expect(screen.getByText('Dette er en error')).toBeVisible();
        consoleErrorSpy.mockRestore();
    });
});

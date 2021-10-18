import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';

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
        render(
            <ErrorBoundary fallback={<span>Dette er en fallback</span>}>
                <ThrowsError />
            </ErrorBoundary>
        );
        expect(screen.getByText('Dette er en fallback')).toBeVisible();
    });
    test('fanger exceptions og rendrer fallback (function)', () => {
        render(
            <ErrorBoundary fallback={(error) => <span>{error.message}</span>}>
                <ThrowsError />
            </ErrorBoundary>
        );
        expect(screen.getByText('Dette er en error')).toBeVisible();
    });
});

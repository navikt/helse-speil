import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import { AgurkErrorBoundary } from './AgurkErrorBoundary';

const swallowErrorsInJsDom = () => {
    window.addEventListener('error', (event: Event) => event.preventDefault());
};

swallowErrorsInJsDom();

const ThrowsError = ({ errorMessage }: { errorMessage: string }) => {
    throw Error(errorMessage);
};

describe('AgurkErrorBoundary', () => {
    test('rendrer feilmelding', async () => {
        const feilmelding = 'Dette er en feil';
        render(
            <AgurkErrorBoundary>
                <ThrowsError errorMessage={`Error: ${feilmelding}`} />
            </AgurkErrorBoundary>,
        );
        expect(await screen.findByText(feilmelding, { exact: false })).toBeVisible();
    });
});

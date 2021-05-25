import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { AgurkErrorBoundary } from './AgurkErrorBoundary';

const swallowErrorsInJsDom = () => {
    window.addEventListener('error', (event: Event) => event.preventDefault());
};

swallowErrorsInJsDom();

const ThrowsError = ({ errorMessage }: { errorMessage: string }) => {
    throw Error(errorMessage);
};

describe('AgurkErrorBoundary', () => {
    test('rendrer feilmelding', () => {
        const feilmelding = 'Dette er en feil';
        render(
            <AgurkErrorBoundary>
                <ThrowsError errorMessage={feilmelding} />
            </AgurkErrorBoundary>
        );
        waitFor(() => expect(screen.queryByText(feilmelding)).toBeVisible());
    });
});

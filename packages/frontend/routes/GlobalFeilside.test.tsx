import { axe } from 'jest-axe';
import React from 'react';

import { render, screen } from '@testing-library/react';

import { GlobalFeilside } from './GlobalFeilside';

describe('GlobalFeilside', () => {
    it('rendrer uten violations', async () => {
        const { container } = render(<GlobalFeilside error={Error()} />);

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer feilmelding', () => {
        render(<GlobalFeilside error={Error('Test')} />);

        expect(screen.queryByText('Error: Test', { exact: false })).toBeVisible();
    });
});

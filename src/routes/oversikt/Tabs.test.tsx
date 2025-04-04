import { axe } from 'jest-axe';
import React from 'react';

import { render } from '@test-utils';
import { screen, within } from '@testing-library/react';

import { Tabs } from './Tabs';

describe('Tabs', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('rendrer uten violations', async () => {
        const { container } = render(<Tabs antallMineSaker={0} antallPåVent={0} />);

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer antall oppgaver', async () => {
        render(<Tabs antallMineSaker={2} antallPåVent={1} />);

        const mineSaker = screen.getByText('Mine saker');
        expect(within(mineSaker).getByText('(2)')).toBeVisible();

        const påVent = screen.getByText('På vent');
        expect(within(påVent).getByText('(1)')).toBeVisible();
    });
});

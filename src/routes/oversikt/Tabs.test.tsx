import { vi } from 'vitest';
import { axe } from 'vitest-axe';

import { render } from '@test-utils';
import { screen, within } from '@testing-library/react';

import { Tabs } from './Tabs';

vi.mock('@hooks/brukerrolleHooks', () => ({
    useErSaksbehandler: () => true,
    useErBeslutter: () => true,
}));

describe('Tabs', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('rendrer uten violations', async () => {
        const { container } = render(<Tabs antallMineSaker={0} antallPåVent={0} />);

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer antall oppgaver', async () => {
        render(<Tabs antallMineSaker={2} antallPåVent={1} />);

        const mineSaker = screen.getByText('Mine oppgaver');
        expect(within(mineSaker).getByText('(2)')).toBeVisible();

        const påVent = screen.getByText('På vent');
        expect(within(påVent).getByText('(1)')).toBeVisible();
    });
});

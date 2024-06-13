import { RecoilWrapper } from '@test-wrappers';
import { axe } from 'jest-axe';
import React from 'react';

import { useAntallOppgaver, useOppgaveFeed } from '@state/oppgaver';
import { enOppgaveForOversikten } from '@test-data/oppgave';
import { render, screen, within } from '@testing-library/react';

import { Tabs } from './Tabs';

jest.mock('@state/oppgaver');

describe('Tabs', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('rendrer uten violations', async () => {
        const oppgaver = [enOppgaveForOversikten()];

        (useOppgaveFeed as jest.Mock).mockReturnValue(oppgaver);
        (useAntallOppgaver as jest.Mock).mockReturnValue({ antallMineSaker: 0, antallPåVent: 0 });

        const { container } = render(<Tabs />, { wrapper: RecoilWrapper });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer antall oppgaver', async () => {
        (useAntallOppgaver as jest.Mock).mockReturnValue({ antallMineSaker: 2, antallPåVent: 1 });

        render(<Tabs />, { wrapper: RecoilWrapper });

        const mineSaker = screen.getByText('Mine saker');
        expect(within(mineSaker).getByText('(2)')).toBeVisible();

        const påVent = screen.getByText('På vent');
        expect(within(påVent).getByText('(1)')).toBeVisible();
    });
});

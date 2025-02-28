import { axe } from 'jest-axe';
import React from 'react';

import { render } from '@/test/test-utils';

import { IngenOppgaver } from './IngenOppgaver';
import { TabType, tabState } from './tabState';

describe('Ingen oppgaver', () => {
    it('rendrer til godkjenning uten violations', async () => {
        const { container } = render(<IngenOppgaver />, { atomValues: [[tabState, TabType.TilGodkjenning]] });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer behandlet idag uten violations', async () => {
        const { container } = render(<IngenOppgaver />, { atomValues: [[tabState, TabType.BehandletIdag]] });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer mine oppgaver uten violations', async () => {
        const { container } = render(<IngenOppgaver />, { atomValues: [[tabState, TabType.Mine]] });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer ventende oppgaver uten violations', async () => {
        const { container } = render(<IngenOppgaver />, { atomValues: [[tabState, TabType.Ventende]] });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });
});

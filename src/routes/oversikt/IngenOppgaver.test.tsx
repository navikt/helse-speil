import { axe } from 'jest-axe';
import React from 'react';

import { wrapperWithJotaiInitalizer } from '@test-wrappers';
import { render } from '@testing-library/react';

import { IngenOppgaver } from './IngenOppgaver';
import { TabType, tabState } from './tabState';

describe('Ingen oppgaver', () => {
    it('rendrer til godkjenning uten violations', async () => {
        const { container } = render(<IngenOppgaver />, {
            wrapper: wrapperWithJotaiInitalizer([[tabState, TabType.TilGodkjenning]]),
        });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer behandlet idag uten violations', async () => {
        const { container } = render(<IngenOppgaver />, {
            wrapper: wrapperWithJotaiInitalizer([[tabState, TabType.BehandletIdag]]),
        });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer mine oppgaver uten violations', async () => {
        const { container } = render(<IngenOppgaver />, {
            wrapper: wrapperWithJotaiInitalizer([[tabState, TabType.Mine]]),
        });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer ventende oppgaver uten violations', async () => {
        const { container } = render(<IngenOppgaver />, {
            wrapper: wrapperWithJotaiInitalizer([[tabState, TabType.Ventende]]),
        });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });
});

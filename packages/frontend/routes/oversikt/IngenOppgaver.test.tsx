import { wrapperWithRecoilInitializer } from '@test-wrappers';
import { axe } from 'jest-axe';
import React from 'react';
import { MutableSnapshot } from 'recoil';

import { render } from '@testing-library/react';

import { IngenOppgaver } from './IngenOppgaver';
import { TabType, tabState } from './Tabs';

const initializerWithTabType =
    (tabType: TabType) =>
    ({ set }: MutableSnapshot) => {
        set(tabState, tabType);
    };

describe('Ingen oppgaver', () => {
    it('rendrer til godkjenning uten violations', async () => {
        const initializer = initializerWithTabType(TabType.TilGodkjenning);
        const { container } = render(<IngenOppgaver />, { wrapper: wrapperWithRecoilInitializer(initializer) });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer behandlet idag uten violations', async () => {
        const initializer = initializerWithTabType(TabType.BehandletIdag);
        const { container } = render(<IngenOppgaver />, { wrapper: wrapperWithRecoilInitializer(initializer) });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer mine oppgaver uten violations', async () => {
        const initializer = initializerWithTabType(TabType.Mine);
        const { container } = render(<IngenOppgaver />, { wrapper: wrapperWithRecoilInitializer(initializer) });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer ventende oppgaver uten violations', async () => {
        const initializer = initializerWithTabType(TabType.Ventende);
        const { container } = render(<IngenOppgaver />, { wrapper: wrapperWithRecoilInitializer(initializer) });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });
});

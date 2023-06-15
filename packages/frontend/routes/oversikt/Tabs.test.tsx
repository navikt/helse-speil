import { RecoilWrapper } from '@test-wrappers';
import { axe } from 'jest-axe';
import { nanoid } from 'nanoid';
import React from 'react';

import { useMineOppgaver, useOppgaver } from '@state/oppgaver';
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

        (useMineOppgaver as jest.Mock).mockReturnValue(oppgaver);
        (useOppgaver as jest.Mock).mockReturnValue(oppgaver);

        const { container } = render(<Tabs />, { wrapper: RecoilWrapper });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer antall oppgaver', async () => {
        const tildeling = {
            epost: 'navn.navnesen@nav.no',
            navn: 'Fornavn Etternavn',
            oid: nanoid(),
            reservert: false,
            paaVent: false,
        };
        const minOppgave = enOppgaveForOversikten({ tildeling });
        const alleOppgaver = [enOppgaveForOversikten(), minOppgave];
        const mineOppgaver = [minOppgave];

        (useMineOppgaver as jest.Mock).mockReturnValue(mineOppgaver);
        (useOppgaver as jest.Mock).mockReturnValue(alleOppgaver);

        render(<Tabs />, { wrapper: RecoilWrapper });

        const tilGodkjenning = screen.getByText('Til godkjenning');
        expect(within(tilGodkjenning).getByText('(2)')).toBeVisible();

        const mineSaker = screen.getByText('Mine saker');
        expect(within(mineSaker).getByText('(1)')).toBeVisible();

        const påVent = screen.getByText('På vent');
        expect(within(påVent).getByText('(0)')).toBeVisible();
    });
});

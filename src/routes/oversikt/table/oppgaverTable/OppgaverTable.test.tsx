import { axe } from 'jest-axe';
import React from 'react';

import { enOppgaveForOversikten } from '@test-data/oppgave';
import { render } from '@test-utils';
import { screen } from '@testing-library/react';

import { OppgaverTable } from './OppgaverTable';

describe('OppgaverTable', () => {
    it('rendres uten violations', async () => {
        const oppgaver = [enOppgaveForOversikten()];

        const { container } = render(
            <OppgaverTable
                antallOppgaver={1}
                numberOfPages={1}
                currentPage={1}
                limit={14}
                setPage={() => {}}
                oppgaver={oppgaver}
                loading={false}
            />,
        );

        expect(await screen.findByText('Saksbehandler')).toBeInTheDocument();

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer alle headere', () => {
        const oppgaver = [enOppgaveForOversikten()];

        render(
            <OppgaverTable
                antallOppgaver={1}
                numberOfPages={1}
                currentPage={1}
                limit={14}
                setPage={() => {}}
                oppgaver={oppgaver}
                loading={false}
            />,
        );

        expect(screen.getByText('Saksbehandler')).toBeVisible();
        expect(screen.getByText('Opprettet')).toBeVisible();

        expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    });
});

// Testen oversteg default setting på 5000 ved kjøring lokalt\
jest.setTimeout(15000);

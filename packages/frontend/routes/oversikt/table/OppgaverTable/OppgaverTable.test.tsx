import { ApolloWrapper } from '@test-wrappers';
import { axe } from 'jest-axe';
import React from 'react';

import { enOppgaveForOversikten } from '@test-data/oppgave';
import { render, screen } from '@testing-library/react';

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
            />,
            { wrapper: ApolloWrapper },
        );

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
            />,
            { wrapper: ApolloWrapper },
        );

        expect(
            screen.getByText(
                (content, element) => element?.tagName.toLowerCase() === 'button' && content.startsWith('Tildelt'),
            ),
        ).toBeVisible();
        expect(screen.getByText('Saksbehandler')).toBeVisible();
        expect(screen.getAllByText(/Periodetype/)).toHaveLength(2);
        expect(screen.getAllByText(/Oppgavetype/)).toHaveLength(2);
        expect(screen.getAllByText(/Mottaker/)).toHaveLength(2);
        expect(screen.getAllByText(/Egenskaper/)).toHaveLength(2);
        expect(screen.getByText(/Opprettet/)).toBeVisible();
        expect(screen.getByText(/Søknad mottatt/)).toBeVisible();

        expect(screen.getAllByRole('columnheader')).toHaveLength(13);
    });
});

// Testen oversteg default setting på 5000 ved kjøring lokalt\
jest.setTimeout(15000);

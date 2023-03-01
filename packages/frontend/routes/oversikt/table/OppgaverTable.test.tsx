import { RecoilWrapper } from '@test-wrappers';
import { axe } from 'jest-axe';
import React from 'react';

import { enOppgaveForOversikten } from '@test-data/oppgave';
import { render, screen } from '@testing-library/react';

import { OppgaverTable } from './OppgaverTable';

describe('OppgaverTable', () => {
    it('rendres uten violations', async () => {
        const oppgaver = [enOppgaveForOversikten()];

        const { container } = render(<OppgaverTable oppgaver={oppgaver} />, { wrapper: RecoilWrapper });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer alle headere', () => {
        const oppgaver = [enOppgaveForOversikten()];

        render(<OppgaverTable oppgaver={oppgaver} />, { wrapper: RecoilWrapper });

        expect(screen.getByText('Tildelt')).toBeVisible();
        expect(screen.getByText('Periodetype')).toBeVisible();
        expect(screen.getByText('Oppgavetype')).toBeVisible();
        expect(screen.getByText('Bosted')).toBeVisible();
        expect(screen.getByText('Inntektskilde')).toBeVisible();
        expect(screen.getByText('Status')).toBeVisible();
        expect(screen.getByText('Søker')).toBeVisible();
        expect(screen.getByText('Opprettet')).toBeVisible();
        expect(screen.getByText('Søknad mottatt')).toBeVisible();

        expect(screen.getAllByRole('columnheader')).toHaveLength(9);
    });
});

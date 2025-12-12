import React from 'react';
import { Mock, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { SortState } from '@navikt/ds-react';

import { useOppgaveFeed } from '@state/oppgaver';
import { enOppgaveForOversikten } from '@test-data/oppgave';
import { render } from '@test-utils';
import { screen } from '@testing-library/react';

import { OppgaverTable } from './OppgaverTable';

const mockSort: SortState = {
    orderBy: 'navn',
    direction: 'ascending',
};

vi.mock('@state/oppgaver');

describe('OppgaverTable', () => {
    it('rendres uten violations', async () => {
        const oppgaver = [enOppgaveForOversikten()];

        (useOppgaveFeed as Mock).mockReturnValue({
            oppgaver,
            antallOppgaver: 1,
            error: undefined,
            loading: false,
            fetchMore: () => {},
        });

        const { container } = render(<OppgaverTable antallMineSaker={1} antallPåVent={1} sort={mockSort} />);

        expect(await screen.findByText('Saksbehandler')).toBeInTheDocument();

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('rendrer alle headere', () => {
        const oppgaver = [enOppgaveForOversikten()];

        (useOppgaveFeed as Mock).mockReturnValue({
            oppgaver,
            antallOppgaver: 1,
            error: undefined,
            loading: false,
            fetchMore: () => {},
        });

        render(<OppgaverTable antallMineSaker={1} antallPåVent={1} sort={mockSort} />);

        expect(screen.getByText('Saksbehandler')).toBeVisible();
        expect(screen.getAllByText('Oppgave klar')).toHaveLength(2);

        expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    });
});

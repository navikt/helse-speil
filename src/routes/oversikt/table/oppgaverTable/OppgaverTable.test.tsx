import React from 'react';
import { Mock, beforeEach, vi } from 'vitest';

import { SortState } from '@navikt/ds-react';

import { axe } from '@/test/axe';
import { ApiEgenskap } from '@io/rest/generated/spesialist.schemas';
import { TabType, tabState } from '@oversikt/tabState';
import { FilterStatus, datofilterAtom, hydrateFilters } from '@oversikt/table/state/filter';
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

        expect(result.violations).toEqual([]);
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

describe('OppgaverTable med datofilter', () => {
    it('viser tom tabell i stedet for «ingen oppgaver» når datofilteret ikke gir treff', () => {
        (useOppgaveFeed as Mock).mockReturnValue({
            oppgaver: [],
            antallOppgaver: 0,
            error: undefined,
            loading: false,
        });

        render(<OppgaverTable antallMineSaker={0} antallPåVent={0} sort={mockSort} />, {
            atomValues: [
                [tabState, TabType.TilGodkjenning],
                [datofilterAtom, { oppgaveKlarFom: '2026-02-01' }],
            ],
        });

        expect(screen.queryByText('Ooops! Ingen oppgaver å plukke...')).not.toBeInTheDocument();
        expect(screen.getByText('Ingen oppgaver matchet disse filtrene')).toBeVisible();
        expect(screen.getByText('Oppgave klar fra: 01.02.2026')).toBeVisible();
    });

    it('viser ikke oppgave klar-filter på Mine oppgaver', () => {
        (useOppgaveFeed as Mock).mockReturnValue({
            oppgaver: [enOppgaveForOversikten()],
            antallOppgaver: 1,
            error: undefined,
            loading: false,
        });

        render(<OppgaverTable antallMineSaker={1} antallPåVent={0} sort={mockSort} />, {
            atomValues: [
                [tabState, TabType.Mine],
                [datofilterAtom, { oppgaveKlarFom: '2026-02-01', oppgaveKlarTom: '2026-03-01' }],
            ],
        });

        expect(screen.queryByText(/Oppgave klar fra/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Oppgave klar til/)).not.toBeInTheDocument();
        expect(screen.getByText('Ingen aktive filter')).toBeVisible();
    });
});

describe('OppgaverTable med filtre som bare gjelder Til godkjenning', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('viser ikke lagret Tildelt-filter som chip på Mine oppgaver', () => {
        localStorage.setItem(
            'filtersPerTab',
            JSON.stringify({
                [TabType.TilGodkjenning]: [],
                [TabType.Ventende]: [],
                [TabType.Mine]: [
                    { key: 'TILDELTE_SAKER', status: FilterStatus.MINUS },
                    { key: ApiEgenskap.UTBETALING_TIL_ARBEIDSGIVER, status: FilterStatus.PLUS },
                ],
            }),
        );
        (useOppgaveFeed as Mock).mockReturnValue({
            oppgaver: [enOppgaveForOversikten()],
            antallOppgaver: 1,
            error: undefined,
            loading: false,
        });

        render(<OppgaverTable antallMineSaker={1} antallPåVent={0} sort={mockSort} />, {
            atomValues: [[tabState, TabType.Mine], hydrateFilters()],
        });

        expect(screen.queryByText('Tildelte oppgaver')).not.toBeInTheDocument();
        expect(screen.getByText('Arbeidsgiver')).toBeVisible();
    });
});

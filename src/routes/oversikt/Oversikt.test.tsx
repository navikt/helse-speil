import React from 'react';
import { Mock, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { HentBehandlingsstatistikkDocument } from '@io/graphql';
import { useAntallOppgaver, useOppgaveFeed } from '@state/oppgaver';
import { enOppgaveForOversikten } from '@test-data/oppgave';
import { act, createMock, render, screen } from '@test-utils';

import { Oversikt } from './Oversikt';

vi.mock('@state/oppgaver');
vi.mock('@external/sanity');
vi.mock('@hooks/useRefetchDriftsmeldinger');

const mockFetch = (data: unknown) =>
    vi.fn().mockImplementation(() =>
        Promise.resolve({
            ok: true,
            json: () => data,
            headers: { get: () => [] },
        }),
    );

describe('Oversikt', () => {
    it('rendrer uten violations', async () => {
        const oppgaver = [enOppgaveForOversikten()];

        (useAntallOppgaver as Mock).mockReturnValue({ antallMineSaker: 0, antallPåVent: 0 });
        (useOppgaveFeed as Mock).mockReturnValue({
            oppgaver,
            antallOppgaver: 1,
            error: undefined,
            loading: false,
            fetchMore: () => {},
        });
        window.fetch = mockFetch([]);

        const { container } = render(<Oversikt />, {
            mocks,
        });

        expect(
            await screen.findByRole('region', { name: 'Toggle visning av behandlingsstatistikk' }),
        ).toBeInTheDocument();
        expect(await screen.findByRole('table', { name: 'Saker som er klare for behandling' })).toBeInTheDocument();
        expect(await screen.findByLabelText('Saksbehandler')).toBeInTheDocument();

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
        });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    }, 10_000);
});

const mocks = [
    createMock({
        request: { query: HentBehandlingsstatistikkDocument },
        result: {
            data: {
                __typename: 'Query',
                behandlingsstatistikk: {
                    __typename: 'Behandlingsstatistikk',
                    antallAnnulleringer: 0,
                    antallAvvisninger: 0,
                    enArbeidsgiver: { __typename: 'Antall', automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                    flereArbeidsgivere: { __typename: 'Antall', automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                    beslutter: { __typename: 'Antall', automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                    egenAnsatt: { __typename: 'Antall', automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                    delvisRefusjon: { __typename: 'Antall', automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                    faresignaler: { __typename: 'Antall', automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                    forlengelser: { __typename: 'Antall', automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                    forlengelseIt: { __typename: 'Antall', automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                    forstegangsbehandling: { __typename: 'Antall', automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                    fortroligAdresse: { __typename: 'Antall', automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                    revurdering: { __typename: 'Antall', automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                    stikkprover: { __typename: 'Antall', automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                    utbetalingTilArbeidsgiver: { __typename: 'Antall', automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                    utbetalingTilSykmeldt: { __typename: 'Antall', automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                },
            },
        },
    }),
];

import { axe } from 'jest-axe';
import React from 'react';

import { useDriftsmelding } from '@external/sanity';
import { HentBehandlingsstatistikkDocument } from '@io/graphql';
import { useGetAktiveSaksbehandlere } from '@io/rest/generated/saksbehandlere/saksbehandlere';
import { useAntallOppgaver, useOppgaveFeed } from '@state/oppgaver';
import { enOppgaveForOversikten } from '@test-data/oppgave';
import { createMock, render, screen } from '@test-utils';

import { Oversikt } from './Oversikt';

jest.mock('@state/oppgaver');
jest.mock('@external/sanity');
jest.mock('@hooks/useRefetchDriftsmeldinger');
jest.mock('@tanstack/react-query');
jest.mock('@io/rest/generated/saksbehandlere/saksbehandlere');

const mockFetch = (data: unknown) =>
    jest.fn().mockImplementation(() =>
        Promise.resolve({
            ok: true,
            json: () => data,
            headers: { get: () => [] },
        }),
    );

describe('Oversikt', () => {
    it('rendrer uten violations', async () => {
        const oppgaver = [enOppgaveForOversikten()];

        (useAntallOppgaver as jest.Mock).mockReturnValue({ antallMineSaker: 0, antallPåVent: 0 });
        (useDriftsmelding as jest.Mock).mockReturnValue({ driftsmelding: null });
        (useOppgaveFeed as jest.Mock).mockReturnValue({
            oppgaver,
            antallOppgaver: 1,
            error: undefined,
            loading: false,
            fetchMore: () => {},
        });
        (useGetAktiveSaksbehandlere as jest.Mock).mockReturnValue({ data: [] });
        window.fetch = mockFetch([]);

        const { container } = render(<Oversikt />, {
            mocks,
        });

        expect(
            await screen.findByRole('region', { name: 'Toggle visning av behandlingsstatistikk' }),
        ).toBeInTheDocument();

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

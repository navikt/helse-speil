import { axe } from 'jest-axe';
import React from 'react';

import { useDriftsmelding } from '@external/sanity';
import { HentBehandlingsstatistikkDocument } from '@io/graphql';
import { useAntallOppgaver, useOppgaveFeed } from '@state/oppgaver';
import { enOppgaveForOversikten } from '@test-data/oppgave';
import { createMock, render, screen } from '@test-utils';

import { Oversikt } from './Oversikt';

jest.mock('@state/oppgaver');
jest.mock('@external/sanity');

describe('Oversikt', () => {
    it('rendrer uten violations', async () => {
        const oppgaver = [enOppgaveForOversikten()];

        (useAntallOppgaver as jest.Mock).mockReturnValue({ antallMineSaker: 0, antallPåVent: 0 });
        (useDriftsmelding as jest.Mock).mockReturnValue({ driftsmelding: null });
        (useOppgaveFeed as jest.Mock).mockReturnValue({
            oppgaver,
            error: undefined,
            loading: false,
            antallOppgaver: 1,
            numberOfPages: 1,
            limit: 14,
            currentPage: 1,
            setPage: () => {},
        });

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

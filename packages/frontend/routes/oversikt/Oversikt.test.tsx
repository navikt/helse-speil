import { ApolloWrapper } from '@test-wrappers';
import { axe } from 'jest-axe';
import React from 'react';

import { HentBehandlingsstatistikkDocument } from '@io/graphql';
import { useAntallOppgaver, useOppgaveFeed } from '@state/oppgaver';
import { enOppgaveForOversikten } from '@test-data/oppgave';
import { render } from '@testing-library/react';

import { Oversikt } from './Oversikt';

describe('Oversikt', () => {
    it('rendrer uten violations', async () => {
        const oppgaver = [enOppgaveForOversikten()];

        (useAntallOppgaver as jest.Mock).mockReturnValue({ antallMineSaker: 0, antallPåVent: 0 });
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
            wrapper: ({ children }) => <ApolloWrapper mocks={mocks}>{children}</ApolloWrapper>,
        });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });
});

const mocks = [
    {
        request: {
            query: HentBehandlingsstatistikkDocument,
        },
        result: () => {
            return {
                data: {
                    behandlingsstatistikk: {
                        antallAnnulleringer: 0,
                        enArbeidsgiver: { automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                        flereArbeidsgivere: { automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                        beslutter: { automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                        delvisRefusjon: { automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                        faresignaler: { automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                        forlengelser: { automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                        forlengelseIt: { automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                        forstegangsbehandling: { automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                        fortroligAdresse: { automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                        revurdering: { automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                        stikkprover: { automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                        utbetalingTilArbeidsgiver: { automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                        utbetalingTilSykmeldt: { automatisk: 1, manuelt: 1, tilgjengelig: 1 },
                    },
                },
            };
        },
    },
];

// Testen oversteg default setting på 5000 ved kjøring lokalt
jest.setTimeout(15000);

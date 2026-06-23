import React from 'react';
import { Mock, vi } from 'vitest';

import { axe } from '@/test/axe';
import { useGetBehandlingsstatistikk } from '@io/rest/generated/behandlingsstatistikk/behandlingsstatistikk';
import { useAntallOppgaver, useOppgaveFeed } from '@state/oppgaver';
import { enOppgaveForOversikten } from '@test-data/oppgave';
import { act, render, screen } from '@test-utils';

import { Oversikt } from './Oversikt';

vi.mock('@state/oppgaver');
vi.mock('@external/sanity');
vi.mock('@hooks/useRefetchDriftsmeldinger');
vi.mock('@io/rest/generated/behandlingsstatistikk/behandlingsstatistikk');

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
        (useGetBehandlingsstatistikk as Mock).mockReturnValue({
            data: behandlingsstatistikk,
            isLoading: false,
            error: null,
        });
        const { container } = render(<Oversikt />);

        expect(
            await screen.findByRole('region', { name: 'Toggle visning av behandlingsstatistikk' }),
        ).toBeInTheDocument();
        expect(await screen.findByRole('table', { name: 'Saker som er klare for behandling' })).toBeInTheDocument();
        expect(await screen.findByLabelText('Saksbehandler')).toBeInTheDocument();

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
        });

        const result = await axe(container);

        expect(result.violations).toEqual([]);
    }, 10_000);
});

const enApiAntall = { automatisk: 1, manuelt: 2, tilgjengelig: 3 };
const behandlingsstatistikk = {
    antallAnnulleringer: 4,
    antallAvvisninger: 5,
    enArbeidsgiver: enApiAntall,
    flereArbeidsgivere: enApiAntall,
    beslutter: enApiAntall,
    egenAnsatt: enApiAntall,
    delvisRefusjon: enApiAntall,
    faresignaler: enApiAntall,
    forlengelser: enApiAntall,
    forlengelseIt: enApiAntall,
    forstegangsbehandling: enApiAntall,
    fortroligAdresse: enApiAntall,
    revurdering: enApiAntall,
    stikkprover: enApiAntall,
    utbetalingTilArbeidsgiver: enApiAntall,
    utbetalingTilSykmeldt: enApiAntall,
};

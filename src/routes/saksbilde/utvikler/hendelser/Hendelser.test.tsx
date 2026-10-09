import { fetchMock, jsonResponse } from '../../../../../vitest.setup';
import React from 'react';

import { SparsomAktiviteterResponse } from '@io/rest/sparsom';
import { render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { Hendelser } from './Hendelser';

const vedtaksperiodeId = 'en-vedtaksperiode-id';
const fødselsnummer = '12345678910';

const aktiviteter: SparsomAktiviteterResponse = {
    aktiviteter: [
        {
            id: '1',
            tidsstempel: '2026-02-01T10:00:00',
            nivå: 'INFO',
            tekst: 'Søknad mottatt',
            kontekster: { Søknad: { meldingsreferanseId: 'en-søknad' }, Vedtaksperiode: { vedtaksperiodeId } },
        },
        {
            id: '2',
            tidsstempel: '2026-02-02T10:00:00',
            nivå: 'VARSEL',
            tekst: 'Varsel fra påminnelse',
            kontekster: { Påminnelse: { meldingsreferanseId: 'en-påminnelse' }, Vedtaksperiode: { vedtaksperiodeId } },
        },
    ],
};

describe('Hendelser', () => {
    beforeEach(() => {
        fetchMock.mockImplementation((input) =>
            Promise.resolve(
                String(input) === '/api/sparsom/aktiviteter'
                    ? jsonResponse(aktiviteter)
                    : jsonResponse({ '@event_name': 'sendt_søknad_nav' }),
            ),
        );
    });

    it('henter aktiviteter fra sparsom og viser hendelsene for vedtaksperioden', async () => {
        render(<Hendelser vedtaksperiodeId={vedtaksperiodeId} fødselsnummer={fødselsnummer} />);

        expect(await screen.findByRole('cell', { name: 'Søknad' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'Påminnelse' })).toBeInTheDocument();

        const [, init] = fetchMock.mock.calls.find(([input]) => String(input) === '/api/sparsom/aktiviteter')!;
        expect(JSON.parse(init!.body as string)).toEqual({ ident: fødselsnummer });
    });

    it('viser aktivitetene når hendelsen ekspanderes', async () => {
        render(<Hendelser vedtaksperiodeId={vedtaksperiodeId} fødselsnummer={fødselsnummer} />);

        const rad = (await screen.findByRole('cell', { name: 'Søknad' })).closest('tr')!;
        const ekspander = within(rad).getByRole('button', { expanded: false, name: 'Vis mer' });
        await userEvent.click(ekspander);

        expect(ekspander).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText('Søknad mottatt')).toBeInTheDocument();
    });

    it('filtrerer bort hendelser uten feil eller varsler', async () => {
        render(<Hendelser vedtaksperiodeId={vedtaksperiodeId} fødselsnummer={fødselsnummer} />);

        await userEvent.click(await screen.findByRole('checkbox', { name: 'Bare feil og varsler' }));

        expect(screen.queryByRole('cell', { name: 'Søknad' })).not.toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'Påminnelse' })).toBeInTheDocument();
    });

    it('henter meldingen fra spleis', async () => {
        render(<Hendelser vedtaksperiodeId={vedtaksperiodeId} fødselsnummer={fødselsnummer} />);

        const visMeldingKnapper = await screen.findAllByRole('button', { name: 'Vis melding' });
        const visSøknad = visMeldingKnapper.find((knapp) => !knapp.hasAttribute('disabled'));
        await userEvent.click(visSøknad!);

        expect(await screen.findByText(/sendt_søknad_nav/)).toBeInTheDocument();
        expect(fetchMock.mock.calls.map(([input]) => String(input))).toContain(
            '/api/spleis/hendelse-json/en-s%C3%B8knad',
        );
    });
});

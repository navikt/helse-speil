import { fetchMock, jsonResponse } from '../../../../vitest.setup';
import React from 'react';

import { SpleisVedtaksperiode } from '@io/rest/spleis';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { PåminnVedtaksperiode } from './PåminnVedtaksperiode';

const vedtaksperiode: SpleisVedtaksperiode = {
    organisasjonsnummer: '987654321',
    yrkesaktivitetstype: 'ARBEIDSTAKER',
    id: 'en-vedtaksperiode-id',
    tilstand: 'AVVENTER_GODKJENNING',
    skjæringstidspunkt: '2026-01-01',
    fom: '2026-01-01',
    tom: '2026-01-31',
    sykmeldingFom: '2026-01-01',
    sykmeldingTom: '2026-01-31',
    opprettet: '2026-02-01T10:00:00',
    oppdatert: '2026-02-01T12:00:00',
};

const fødselsnummer = '12345678910';

const sendtePåminnelser = () =>
    fetchMock.mock.calls.filter(([input]) => String(input) === '/api/spout/melding').map(([, init]) => init!);

describe('PåminnVedtaksperiode', () => {
    beforeEach(() => {
        fetchMock.mockImplementation(() =>
            Promise.resolve(
                jsonResponse({
                    meldinger: [{ id: 'en-melding-id', tidspunkt: '2026-10-09T12:00:00', melding: {}, metadata: {} }],
                    lenker: { kibana: 'https://logs.adeo.no' },
                }),
            ),
        );
    });

    it('sender ikke påminnelse når begrunnelsen er for kort', async () => {
        render(<PåminnVedtaksperiode vedtaksperiode={vedtaksperiode} fødselsnummer={fødselsnummer} />);

        await userEvent.type(screen.getByLabelText('Begrunnelse'), 'for kort');
        await userEvent.click(screen.getByRole('button', { name: 'Påminn vedtaksperiode' }));

        expect(await screen.findByText('Begrunnelsen må være minst 15 tegn')).toBeInTheDocument();
        expect(sendtePåminnelser()).toHaveLength(0);
    });

    it('sender påminnelse til spout med begrunnelse og slack-lenke', async () => {
        render(<PåminnVedtaksperiode vedtaksperiode={vedtaksperiode} fødselsnummer={fødselsnummer} />);

        await userEvent.type(screen.getByLabelText('Begrunnelse'), 'Perioden har satt seg fast');
        await userEvent.type(screen.getByLabelText('Slack-lenke'), 'https://nav-it.slack.com/archives/123');
        await userEvent.click(screen.getByRole('button', { name: 'Påminn vedtaksperiode' }));

        expect(await screen.findByText('Påminnelse sendt')).toBeInTheDocument();

        const [request] = sendtePåminnelser();
        expect(request?.method).toBe('POST');
        const body = request?.body as URLSearchParams;
        expect(body.get('begrunnelse')).toBe('Perioden har satt seg fast');
        expect(body.get('issueLink')).toBe('https://nav-it.slack.com/archives/123');
        expect(JSON.parse(body.get('json')!)).toEqual({
            json: {
                '@event_name': 'påminnelse',
                fødselsnummer,
                organisasjonsnummer: '987654321',
                yrkesaktivitetstype: 'ARBEIDSTAKER',
                vedtaksperiodeId: 'en-vedtaksperiode-id',
                tilstand: 'AVVENTER_GODKJENNING',
                påminnelsestidspunkt: '{{now}}',
                nestePåminnelsestidspunkt: '{{now+1h}}',
                tilstandsendringstidspunkt: '2026-02-01T12:00:00',
                antallGangerPåminnet: 1,
                flagg: [],
            },
        });
    });

    it('viser feilmeldingen fra spout', async () => {
        fetchMock.mockImplementation(() =>
            Promise.resolve(jsonResponse({ meldinger: [{ feil: 'Noe gikk galt i Spout' }] }, 400)),
        );
        render(<PåminnVedtaksperiode vedtaksperiode={vedtaksperiode} fødselsnummer={fødselsnummer} />);

        await userEvent.type(screen.getByLabelText('Begrunnelse'), 'Perioden har satt seg fast');
        await userEvent.click(screen.getByRole('button', { name: 'Påminn vedtaksperiode' }));

        expect(await screen.findByText('Noe gikk galt i Spout')).toBeInTheDocument();
    });
});

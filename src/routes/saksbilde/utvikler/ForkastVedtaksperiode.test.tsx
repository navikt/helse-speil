import { fetchMock, jsonResponse } from '../../../../vitest.setup';
import React from 'react';

import { SpleisVedtaksperiode } from '@io/rest/spleis';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { ForkastVedtaksperiode } from './ForkastVedtaksperiode';

const vedtaksperiode: SpleisVedtaksperiode = {
    organisasjonsnummer: '987654321',
    yrkesaktivitetstype: 'ARBEIDSTAKER',
    id: 'en-vedtaksperiode-id',
    tilstand: 'AVVENTER_INNTEKTSMELDING',
    skjæringstidspunkt: '2026-01-01',
    fom: '2026-01-01',
    tom: '2026-01-31',
    sykmeldingFom: '2026-01-01',
    sykmeldingTom: '2026-01-31',
    opprettet: '2026-02-01T10:00:00',
    oppdatert: '2026-02-01T12:00:00',
};

const fødselsnummer = '12345678910';

const sendteMeldinger = () =>
    fetchMock.mock.calls.filter(([input]) => String(input) === '/api/spout/melding').map(([, init]) => init!);

describe('ForkastVedtaksperiode', () => {
    beforeEach(() => {
        fetchMock.mockImplementation(() =>
            Promise.resolve(
                jsonResponse({
                    meldinger: [{ id: 'en-melding-id', tidspunkt: '2026-10-09T12:00:00', melding: {}, metadata: {} }],
                }),
            ),
        );
    });

    it('sender ikke anmodning om forkasting når begrunnelsen er for kort', async () => {
        render(<ForkastVedtaksperiode vedtaksperiode={vedtaksperiode} fødselsnummer={fødselsnummer} />);

        await userEvent.type(screen.getByLabelText('Begrunnelse'), 'for kort');
        await userEvent.click(screen.getByRole('button', { name: 'Forkast vedtaksperiode' }));

        expect(await screen.findByText('Begrunnelsen må være minst 15 tegn')).toBeInTheDocument();
        expect(sendteMeldinger()).toHaveLength(0);
    });

    it('sender anmodning om forkasting til spout', async () => {
        render(<ForkastVedtaksperiode vedtaksperiode={vedtaksperiode} fødselsnummer={fødselsnummer} />);

        await userEvent.type(screen.getByLabelText('Begrunnelse'), 'Perioden skal forkastes');
        await userEvent.click(screen.getByRole('button', { name: 'Forkast vedtaksperiode' }));

        expect(await screen.findByText('Anmodning om forkasting sendt')).toBeInTheDocument();

        const [request] = sendteMeldinger();
        const body = request?.body as URLSearchParams;
        expect(body.get('begrunnelse')).toBe('Perioden skal forkastes');
        expect(JSON.parse(body.get('json')!)).toEqual({
            json: {
                '@event_name': 'anmodning_om_forkasting',
                yrkesaktivitetstype: 'ARBEIDSTAKER',
                fødselsnummer,
                organisasjonsnummer: '987654321',
                vedtaksperiodeId: 'en-vedtaksperiode-id',
                årsaker: ['Forkastet manuelt av utvikler'],
            },
        });
    });
});

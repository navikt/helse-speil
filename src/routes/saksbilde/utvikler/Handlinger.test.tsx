import React from 'react';

import { SpleisVedtaksperiode } from '@io/rest/spleis';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { Handlinger } from './Handlinger';

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

describe('Handlinger', () => {
    it('viser påminnelse som standard og bytter til forkasting når den velges', async () => {
        render(<Handlinger vedtaksperiode={vedtaksperiode} fødselsnummer="12345678910" />);

        expect(screen.getByRole('button', { name: 'Påminn vedtaksperiode' })).toBeInTheDocument();

        await userEvent.selectOptions(screen.getByLabelText('Handling'), 'anmodning_om_forkasting');

        expect(screen.getByRole('button', { name: 'Forkast vedtaksperiode' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Påminn vedtaksperiode' })).not.toBeInTheDocument();
    });
});

import React from 'react';
import { Utbetaling } from './Utbetaling';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import { Avvisningsskjema } from './Utbetalingsdialog';
import { Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import '@testing-library/jest-dom/extend-expect';
import '../../../../../tekster';
import { VedtaksperiodeBuilder } from '../../../../../mapping/vedtaksperiode';
import { umappetVedtaksperiode } from '../../../../../../test/data/vedtaksperiode';
import { SpesialistArbeidsgiver } from 'external-types';

const UtbetalingView = ({ vedtaksperiode }: { vedtaksperiode: Vedtaksperiode }) => (
    <MemoryRouter>
        <Utbetaling vedtaksperiode={vedtaksperiode} />
    </MemoryRouter>
);

const vedtaksperiodeMedTilstand = (tilstand: Vedtaksperiodetilstand) => ({
    ...enSpeilVedtaksperiode(),
    tilstand: tilstand,
});

const enSpeilVedtaksperiode = (): Vedtaksperiode => {
    const { vedtaksperiode } = new VedtaksperiodeBuilder()
        .setVedtaksperiode(umappetVedtaksperiode())
        .setArbeidsgiver({ organisasjonsnummer: '123456789' } as SpesialistArbeidsgiver)
        .setOverstyringer([])
        .build();
    return vedtaksperiode as Vedtaksperiode;
};

jest.mock('../../../../../io/http', () => ({
    postVedtak: async (_godkjent: boolean, _skjema?: Avvisningsskjema) => Promise.resolve(),
}));

describe('Utbetalingsknapp vises ikke ved tilstand:', () => {
    test('Utbetalt', async () => {
        render(<UtbetalingView vedtaksperiode={vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.Utbetalt)} />);
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    test('Avslag', async () => {
        render(<UtbetalingView vedtaksperiode={vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.Avslag)} />);
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });
});

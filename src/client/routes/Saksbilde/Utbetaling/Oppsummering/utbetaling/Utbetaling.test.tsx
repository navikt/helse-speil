import React from 'react';
import dayjs from 'dayjs';
import { Utbetaling } from './Utbetaling';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import { Avvisningsskjema } from './Utbetalingsdialog';
import { Arbeidsgiver, Kjønn, Person, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import '@testing-library/jest-dom/extend-expect';
import '../../../../../tekster';
import { VedtaksperiodeBuilder } from '../../../../../mapping/vedtaksperiode';
import { umappetVedtaksperiode } from '../../../../../../test/data/vedtaksperiode';
import { SpesialistArbeidsgiver } from 'external-types';

const UtbetalingView = ({ vedtaksperiode, person }: { vedtaksperiode: Vedtaksperiode; person: Person }) => (
    <MemoryRouter>
        <Utbetaling person={person} vedtaksperiode={vedtaksperiode} />
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

const enPersoninfo = () => ({
    fornavn: 'Kari',
    mellomnavn: null,
    etternavn: 'Normann',
    kjønn: 'Mann' as Kjønn,
    fødselsdato: dayjs(),
});

const enArbeidsgiver = (): Arbeidsgiver => ({
    id: '123',
    navn: 'En bedrift',
    organisasjonsnummer: '123456789',
    vedtaksperioder: [enSpeilVedtaksperiode()],
});

const personTilBehandling = (): Person => ({
    aktørId: '12345',
    fødselsnummer: '12345678901',
    arbeidsgivere: [enArbeidsgiver()],
    utbetalinger: [],
    personinfo: enPersoninfo(),
    infotrygdutbetalinger: [],
    enhet: { id: '', navn: '' },
});

jest.mock('../../../../../io/http', () => ({
    postVedtak: async (_godkjent: boolean, _skjema?: Avvisningsskjema) => Promise.resolve(),
}));

describe('Utbetalingsknapp vises ikke ved tilstand:', () => {
    test('Utbetalt', async () => {
        render(
            <UtbetalingView
                person={personTilBehandling()}
                vedtaksperiode={vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.Utbetalt)}
            />
        );
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    test('Avslag', async () => {
        render(
            <UtbetalingView
                person={personTilBehandling()}
                vedtaksperiode={vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.Avslag)}
            />
        );
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });
});

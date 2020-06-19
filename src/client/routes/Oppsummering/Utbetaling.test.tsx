import Utbetaling from './Utbetaling';
import { PersonContext } from '../../context/PersonContext';
import { mapVedtaksperiode } from '../../context/mapping/vedtaksperiodemapper';
import { enVedtaksperiode } from '../../context/mapping/testdata/enVedtaksperiode';
import { Kjønn, Vedtaksperiode, Vedtaksperiodetilstand } from '../../context/types.internal';
import { Avvisningverdier } from './modal/useSkjemaState';
import '../../tekster';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router';
import dayjs from 'dayjs';

describe('Utbetaling viser korrekt informasjon', () => {
    test('Viser advarsel før godkjenning', () => {
        render(<UtbetalingView />);
        expect(screen.getByText(/Utbetaling skal kun skje/)).toBeInTheDocument();
        expect(screen.getAllByRole('button')[0]).toHaveTextContent('Utbetal');
        expect(screen.getAllByRole('button')[1]).toHaveTextContent('Behandle i Infotrygd');
    });

    test('Utbetalt', () => {
        render(<UtbetalingView vedtaksperiode={vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.Utbetalt)} />);
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeInTheDocument();
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    test('Avslag', () => {
        render(<UtbetalingView vedtaksperiode={vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.Avslag)} />);
        expect(screen.getByText('Utbetalingen er sendt til annullering.')).toBeInTheDocument();
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });
});

const UtbetalingView = ({ vedtaksperiode = enSpeilVedtaksperiode() }: { vedtaksperiode?: Vedtaksperiode }) => (
    <Router history={createMemoryHistory()}>
        <PersonContext.Provider
            value={{
                personTilBehandling,
                tildelPerson: (_) => null,
                hentPerson: (_) => Promise.resolve(undefined),
                isFetching: false,
                aktiverVedtaksperiode: (_) => null,
                aktivVedtaksperiode: vedtaksperiode,
            }}
        >
            <Utbetaling />
        </PersonContext.Provider>
    </Router>
);

const vedtaksperiodeMedTilstand = (tilstand: Vedtaksperiodetilstand) => ({ ...enSpeilVedtaksperiode(), tilstand });

const enSpeilVedtaksperiode = () => mapVedtaksperiode(enVedtaksperiode(), '123456789', []);
const enPersoninfo = () => ({
    kjønn: 'Mann' as Kjønn,
    fødselsdato: dayjs(),
});
const enArbeidsgiver = () => ({
    id: '123',
    navn: 'En bedrift',
    organisasjonsnummer: '123456789',
    vedtaksperioder: [enSpeilVedtaksperiode()],
});
const personTilBehandling = {
    aktørId: '12345',
    fødselsnummer: '12345678901',
    arbeidsgivere: [enArbeidsgiver()],
    navn: {
        fornavn: 'Kari',
        mellomnavn: null,
        etternavn: 'Normann',
    },
    personinfo: enPersoninfo(),
    infotrygdutbetalinger: [],
    enhet: { id: '', navn: '' },
};

jest.mock('../../io/http', () => ({
    postVedtak: async (_godkjent: boolean, _skjema?: Avvisningverdier) => Promise.resolve(),
}));

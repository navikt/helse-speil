import Utbetaling from './Utbetaling';
import { PersonContext } from '../../../context/PersonContext';
import { mapVedtaksperiode } from '../../../context/mapping/vedtaksperiode';
import { enVedtaksperiode } from '../../../context/mapping/testdata/enVedtaksperiode';
import { Kjønn, Overstyring, Person, Vedtaksperiode, Vedtaksperiodetilstand } from '../../../context/types.internal';
import { Avvisningverdier } from './modal/useSkjemaState';
import '../../../tekster';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router';
import dayjs from 'dayjs';

describe('Utbetaling viser korrekt informasjon', async () => {
    test('Viser advarsel før godkjenning', async () => {
        render(<UtbetalingView person={await personTilBehandling()} vedtaksperiode={await enSpeilVedtaksperiode()} />);
        expect(screen.getByText(/Utbetaling skal kun skje/)).toBeInTheDocument();
        expect(screen.getAllByRole('button')[0]).toHaveTextContent('Utbetal');
        expect(screen.getAllByRole('button')[1]).toHaveTextContent('Behandle i Infotrygd');
    });

    test('Utbetalt', async () => {
        render(
            <UtbetalingView
                person={await personTilBehandling()}
                vedtaksperiode={await vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.Utbetalt)}
            />
        );
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeInTheDocument();
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    test('Avslag', async () => {
        render(
            <UtbetalingView
                person={await personTilBehandling()}
                vedtaksperiode={await vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.Avslag)}
            />
        );
        expect(screen.getByText('Utbetalingen er sendt til annullering.')).toBeInTheDocument();
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });
});

const UtbetalingView = ({ vedtaksperiode, person }: { vedtaksperiode?: Vedtaksperiode; person: Person }) => (
    <Router history={createMemoryHistory()}>
        <PersonContext.Provider
            value={{
                personTilBehandling: person,
                markerPersonSomTildelt: (_) => null,
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

const vedtaksperiodeMedTilstand = async (tilstand: Vedtaksperiodetilstand) => ({
    ...(await enSpeilVedtaksperiode()),
    tilstand,
});

const enSpeilVedtaksperiode = () => mapVedtaksperiode(enVedtaksperiode(), '123456789', []);

const enPersoninfo = () => ({
    fornavn: 'Kari',
    mellomnavn: null,
    etternavn: 'Normann',
    kjønn: 'Mann' as Kjønn,
    fødselsdato: dayjs(),
});

const enArbeidsgiver = async () => ({
    id: '123',
    navn: 'En bedrift',
    organisasjonsnummer: '123456789',
    vedtaksperioder: [await enSpeilVedtaksperiode()],
    overstyringer: new Map<string, Overstyring>(),
});

const personTilBehandling = async () => ({
    aktørId: '12345',
    fødselsnummer: '12345678901',
    arbeidsgivere: [await enArbeidsgiver()],
    personinfo: enPersoninfo(),
    infotrygdutbetalinger: [],
    enhet: { id: '', navn: '' },
});

jest.mock('../../../io/http', () => ({
    postVedtak: async (_godkjent: boolean, _skjema?: Avvisningverdier) => Promise.resolve(),
}));

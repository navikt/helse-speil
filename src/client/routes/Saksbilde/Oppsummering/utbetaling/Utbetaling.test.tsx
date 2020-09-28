import React from 'react';
import dayjs from 'dayjs';
import { Utbetaling } from './Utbetaling';
import { MemoryRouter } from 'react-router';
import { PersonContext } from '../../../../context/PersonContext';
import { render, screen } from '@testing-library/react';
import { Avvisningsskjema } from './Utbetalingsdialog';
import { mapVedtaksperiode } from '../../../../mapping/vedtaksperiode';
import { umappetVedtaksperiode } from '../../../../../test/data/vedtaksperiode';
import { Kjønn, Overstyring, Person, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import '@testing-library/jest-dom/extend-expect';
import '../../../../tekster';

const UtbetalingView = ({ vedtaksperiode, person }: { vedtaksperiode?: Vedtaksperiode; person: Person }) => (
    <MemoryRouter>
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
    </MemoryRouter>
);

const vedtaksperiodeMedTilstand = async (tilstand: Vedtaksperiodetilstand) => ({
    ...(await enSpeilVedtaksperiode()),
    tilstand,
});

const enSpeilVedtaksperiode = () =>
    mapVedtaksperiode({
        overstyringer: [],
        ...umappetVedtaksperiode(),
        organisasjonsnummer: '123456789',
        risikovurderingerForArbeidsgiver: [],
    });

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

jest.mock('../../../../io/http', () => ({
    postVedtak: async (_godkjent: boolean, _skjema?: Avvisningsskjema) => Promise.resolve(),
}));

describe('Utbetaling viser korrekt informasjon', () => {
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

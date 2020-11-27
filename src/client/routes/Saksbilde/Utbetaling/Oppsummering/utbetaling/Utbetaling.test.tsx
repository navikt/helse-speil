import React from 'react';
import dayjs from 'dayjs';
import { Utbetaling } from './Utbetaling';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import { Avvisningsskjema } from './Utbetalingsdialog';
import { Kjønn, Overstyring, Person, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import '@testing-library/jest-dom/extend-expect';
import '../../../../../tekster';
import { mapVedtaksperiode } from '../../../../../mapping/vedtaksperiode';
import { umappetVedtaksperiode } from '../../../../../../test/data/vedtaksperiode';
import { PersonContext } from '../../../../../context/PersonContext';

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

const enSpeilVedtaksperiode = async () => {
    const { vedtaksperiode } = await mapVedtaksperiode({
        overstyringer: [],
        ...umappetVedtaksperiode(),
        organisasjonsnummer: '123456789',
    });
    return vedtaksperiode;
};

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

jest.mock('../../../../../io/http', () => ({
    postVedtak: async (_godkjent: boolean, _skjema?: Avvisningsskjema) => Promise.resolve(),
}));

describe('Utbetalingsknapp vises ikke ved tilstand:', () => {
    test('Utbetalt', async () => {
        render(
            <UtbetalingView
                person={await personTilBehandling()}
                vedtaksperiode={await vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.Utbetalt)}
            />
        );
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    test('Avslag', async () => {
        render(
            <UtbetalingView
                person={await personTilBehandling()}
                vedtaksperiode={await vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.Avslag)}
            />
        );
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });
});

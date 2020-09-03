import { render, screen } from '@testing-library/react';
import React from 'react';
import { Sykmeldingsperiodetabell } from './Sykmeldingsperiodetabell';
import { enVedtaksperiode } from '../../../context/mapping/testdata/enVedtaksperiode';
import { Person } from '../../../context/types.internal';
import { mapVedtaksperiode } from '../../../context/mapping/vedtaksperiode';
import { PersonContext } from '../../../context/PersonContext';
import { SpleisVedtaksperiodetilstand } from '../../../context/mapping/types.external';

const enIkkeUtbetaltVedtaksperiode = () =>
    mapVedtaksperiode({
        ...enVedtaksperiode(),
        organisasjonsnummer: '123456789',
        risikovurderingerForArbeidsgiver: [],
        overstyringer: [],
    });

const enUtbetaltVedtaksperiode = () =>
    mapVedtaksperiode({
        ...enVedtaksperiode(),
        organisasjonsnummer: '123456789',
        risikovurderingerForArbeidsgiver: [],
        overstyringer: [],
        tilstand: SpleisVedtaksperiodetilstand.Utbetalt,
    });

it('Viser endreknapp med ikke utbetalt vedtaksperiode', async () => {
    const { getByText } = render(
        <PersonContext.Provider
            value={{
                personTilBehandling: {} as Person,
                hentPerson: (_) => Promise.resolve(undefined),
                markerPersonSomTildelt: (_) => null,
                isFetching: false,
                aktiverVedtaksperiode: (_) => null,
                aktivVedtaksperiode: await enIkkeUtbetaltVedtaksperiode(),
            }}
        >
            <Sykmeldingsperiodetabell toggleOverstyring={() => true} />
        </PersonContext.Provider>
    );

    expect(getByText('Endre')).toBeTruthy();
});

it('Viser ikke endreknapp med ikke utbetalt vedtaksperiode', async () => {
    render(
        <PersonContext.Provider
            value={{
                personTilBehandling: {} as Person,
                hentPerson: (_) => Promise.resolve(undefined),
                markerPersonSomTildelt: (_) => null,
                isFetching: false,
                aktiverVedtaksperiode: (_) => null,
                aktivVedtaksperiode: await enUtbetaltVedtaksperiode(),
            }}
        >
            <Sykmeldingsperiodetabell toggleOverstyring={() => true} />
        </PersonContext.Provider>
    );

    expect(screen.queryByText('Endre')).toBeNull();
});

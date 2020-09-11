import React from 'react';
import { render, screen } from '@testing-library/react';
import { enVedtaksperiode } from '../../../context/mapping/testdata/enVedtaksperiode';
import { mapVedtaksperiode } from '../../../context/mapping/vedtaksperiode';
import { Person, Vedtaksperiode } from '../../../context/types.internal';
import { Sykmeldingsperiodetabell } from './Sykmeldingsperiodetabell';
import { SpleisVedtaksperiodetilstand } from '../../../context/mapping/types.external';
import { PersonContext, PersonContextValue } from '../../../context/PersonContext';

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

const renderSykmeldingsperiodetabellMedState = (vedtaksperiode: Vedtaksperiode) => {
    const defaultContext: PersonContextValue = {
        personTilBehandling: {} as Person,
        hentPerson: (_) => Promise.resolve(undefined),
        markerPersonSomTildelt: (_) => null,
        isFetching: false,
        aktiverVedtaksperiode: (_) => null,
    };
    return render(
        <PersonContext.Provider value={{ ...defaultContext, aktivVedtaksperiode: vedtaksperiode }}>
            <Sykmeldingsperiodetabell toggleOverstyring={() => true} />
        </PersonContext.Provider>
    );
};

describe('Sykmeldingsperiodetabell', () => {
    test('rendrer Sykmeldingsperiode- og Graderingskolonne', async () => {
        renderSykmeldingsperiodetabellMedState(await enIkkeUtbetaltVedtaksperiode());
        expect(screen.getByText('Sykmeldingsperiode')).toBeVisible();
        expect(screen.getByText('Gradering')).toBeVisible();
    });
    test('rendrer endreknapp ved ikke utbetalt vedtaksperiode', async () => {
        renderSykmeldingsperiodetabellMedState(await enIkkeUtbetaltVedtaksperiode());
        expect(screen.getByText('Endre')).toBeVisible();
    });
    test('rendrer ikke endreknapp ved ikke utbetalt vedtaksperiode', async () => {
        renderSykmeldingsperiodetabellMedState(await enUtbetaltVedtaksperiode());
        expect(screen.queryByText('Endre')).toBeNull();
    });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { mapVedtaksperiode } from '../../../mapping/vedtaksperiode';
import { umappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';
import { Person, Vedtaksperiode } from 'internal-types';
import { Sykmeldingsperiodetabell } from './Sykmeldingsperiodetabell';
import { SpleisVedtaksperiodetilstand } from 'external-types';
import { PersonContext, PersonContextValue } from '../../../context/PersonContext';
import '@testing-library/jest-dom/extend-expect';

const enIkkeUtbetaltVedtaksperiode = () =>
    mapVedtaksperiode({
        ...umappetVedtaksperiode(),
        organisasjonsnummer: '123456789',
        overstyringer: [],
    });

const enUtbetaltVedtaksperiode = () =>
    mapVedtaksperiode({
        ...umappetVedtaksperiode(),
        organisasjonsnummer: '123456789',
        overstyringer: [],
        tilstand: SpleisVedtaksperiodetilstand.Utbetalt,
    });

const renderSykmeldingsperiodetabellMedState = (vedtaksperiode: Vedtaksperiode) => {
    const defaultContext: PersonContextValue = {
        personTilBehandling: {} as Person,
        hentPerson: (_: any) => Promise.resolve(undefined),
        markerPersonSomTildelt: (_: any) => null,
        isFetching: false,
        aktiverVedtaksperiode: (_: any) => null,
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

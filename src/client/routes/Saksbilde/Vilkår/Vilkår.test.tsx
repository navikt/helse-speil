import { Kjønn, Overstyring, Periodetype, Person, Vedtaksperiode } from '../../../context/types.internal';
import { mapVedtaksperiode } from '../../../context/mapping/vedtaksperiode';
import { enVedtaksperiode } from '../../../context/mapping/testdata/enVedtaksperiode';
import dayjs from 'dayjs';
import { PersonContext } from '../../../context/PersonContext';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Vilkår from './Vilkår';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';

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

const vilkårTilVurdering = () => screen.queryByText('Vilkår systemet ikke vurderer');
const automatiskVurderteVilkår = () => screen.queryByText('Vurderte vilkår');
const behandletAvInfotrygd = () => screen.queryByText('Behandlet av infotrygd');
const behandletInnhold = () => screen.queryByText('Behandlet innhold');

const VilkårWrapper = ({ vedtaksperiode, person }: { vedtaksperiode?: Vedtaksperiode; person: Person }) => (
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
            <Vilkår />
        </PersonContext.Provider>
    </Router>
);

describe('Vilkår', async () => {
    describe('ubehandlet', async () => {
        test('skal ha automatisk vurderte vilkår og vilkår til vurdering', async () => {
            render(
                <VilkårWrapper person={await personTilBehandling()} vedtaksperiode={await enSpeilVedtaksperiode()} />
            );

            expect(vilkårTilVurdering()).toBeInTheDocument();
            expect(automatiskVurderteVilkår()).toBeInTheDocument();
            expect(behandletInnhold()).not.toBeInTheDocument();
            expect(behandletAvInfotrygd()).not.toBeInTheDocument();
        });
        test('påfølgende skal ha automatisk vurderte vilkår, vilkår til vurdering og behandlet innhold', async () => {
            const person = await personTilBehandling();
            const vedtaksperiode = await enSpeilVedtaksperiode();
            const aktivVedtaksperiode = {
                ...vedtaksperiode,
                periodetype: Periodetype.Forlengelse,
            };
            render(<VilkårWrapper person={person} vedtaksperiode={aktivVedtaksperiode} />);

            expect(vilkårTilVurdering()).toBeInTheDocument();
            expect(automatiskVurderteVilkår()).toBeInTheDocument();
            expect(behandletInnhold()).toBeInTheDocument();
            expect(behandletAvInfotrygd()).not.toBeInTheDocument();
        });
        test('påfølgende infotrygd skal ha automatisk vurderte vilkår, vilkår til vurdering og behandlet av infotrygd', async () => {
            const person = await personTilBehandling();
            const vedtaksperiode = await enSpeilVedtaksperiode();
            const aktivVedtaksperiode = {
                ...vedtaksperiode,
                periodetype: Periodetype.Infotrygdforlengelse,
            };
            render(<VilkårWrapper person={person} vedtaksperiode={aktivVedtaksperiode} />);

            expect(vilkårTilVurdering()).toBeInTheDocument();
            expect(automatiskVurderteVilkår()).toBeInTheDocument();
            expect(behandletInnhold()).not.toBeInTheDocument();
            expect(behandletAvInfotrygd()).toBeInTheDocument();
        });
    });

    describe('behandlet', async () => {
        test('skal ha behandlet innhold', async () => {
            const person = await personTilBehandling();
            const vedtaksperiode = await enSpeilVedtaksperiode();
            const aktivVedtaksperiode = {
                ...vedtaksperiode,
                behandlet: true,
            };
            render(<VilkårWrapper person={person} vedtaksperiode={aktivVedtaksperiode} />);

            expect(vilkårTilVurdering()).not.toBeInTheDocument();
            expect(automatiskVurderteVilkår()).not.toBeInTheDocument();
            expect(behandletInnhold()).toBeInTheDocument();
            expect(behandletAvInfotrygd()).not.toBeInTheDocument();
        });
        test('påfølgende skal ha behandlet innhold', async () => {
            const person = await personTilBehandling();
            const vedtaksperiode = await enSpeilVedtaksperiode();
            const aktivVedtaksperiode = {
                ...vedtaksperiode,
                behandlet: true,
                periodetype: Periodetype.Forlengelse,
            };
            render(<VilkårWrapper person={person} vedtaksperiode={aktivVedtaksperiode} />);

            expect(vilkårTilVurdering()).not.toBeInTheDocument();
            expect(automatiskVurderteVilkår()).not.toBeInTheDocument();
            expect(behandletInnhold()).toBeInTheDocument();
            expect(behandletAvInfotrygd()).not.toBeInTheDocument();
        });
        test('infotrygd skal ha behandlet innhold og behandlet av infotrygd', async () => {
            const person = await personTilBehandling();
            const vedtaksperiode = await enSpeilVedtaksperiode();
            const aktivVedtaksperiode = {
                ...vedtaksperiode,
                forlengelseFraInfotrygd: true,
                behandlet: true,
            };
            render(<VilkårWrapper person={person} vedtaksperiode={aktivVedtaksperiode} />);

            expect(vilkårTilVurdering()).not.toBeInTheDocument();
            expect(automatiskVurderteVilkår()).not.toBeInTheDocument();
            expect(behandletInnhold()).toBeInTheDocument();
            expect(behandletAvInfotrygd()).toBeInTheDocument();
        });
    });
});

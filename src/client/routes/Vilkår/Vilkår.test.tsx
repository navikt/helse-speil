import { Kjønn, Vedtaksperiode, Periodetype } from '../../context/types.internal';
import { mapVedtaksperiode } from '../../context/mapping/vedtaksperiodemapper';
import { enVedtaksperiode } from '../../context/mapping/testdata/enVedtaksperiode';
import dayjs from 'dayjs';
import { PersonContext } from '../../context/PersonContext';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Vilkår from './Vilkår';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';

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

const vilkårTilVurdering = () => screen.queryByText('Vilkår systemet ikke vurderer');
const automatiskVurderteVilkår = () => screen.queryByText('Vurderte vilkår');
const behandletAvInfotrygd = () => screen.queryByText('Behandlet av infotrygd');
const behandletInnhold = () => screen.queryByText('Behandlet innhold');

const VilkårWrapper = ({ vedtaksperiode = enSpeilVedtaksperiode() }: { vedtaksperiode?: Vedtaksperiode }) => (
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
            <Vilkår />
        </PersonContext.Provider>
    </Router>
);

describe('Vilkår', () => {
    describe('ubehandlet - ', () => {
        test('ubehandlet skal ha automatisk vurderte vilkår og vilkår til vurdering', () => {
            render(<VilkårWrapper />);

            expect(vilkårTilVurdering()).toBeInTheDocument();
            expect(automatiskVurderteVilkår()).toBeInTheDocument();
            expect(behandletInnhold()).not.toBeInTheDocument();
            expect(behandletAvInfotrygd()).not.toBeInTheDocument();
        });
        test('ubehandlet påfølgende skal ha automatisk vurderte vilkår, vilkår til vurdering og behandlet innhold', () => {
            const vedtaksperiode = enSpeilVedtaksperiode();
            const aktivVedtaksperiode = {
                ...vedtaksperiode,
                periodetype: Periodetype.Forlengelse,
                rawData: { ...vedtaksperiode.rawData, førsteFraværsdag: '2019-10-06' },
            };
            render(<VilkårWrapper vedtaksperiode={aktivVedtaksperiode} />);

            expect(vilkårTilVurdering()).toBeInTheDocument();
            expect(automatiskVurderteVilkår()).toBeInTheDocument();
            expect(behandletInnhold()).toBeInTheDocument();
            expect(behandletAvInfotrygd()).not.toBeInTheDocument();
        });
        test('ubehandlet påfølgende infotrygd skal ha automatisk vurderte vilkår, vilkår til vurdering og behandlet av infotrygd', () => {
            const vedtaksperiode = enSpeilVedtaksperiode();
            const aktivVedtaksperiode = {
                ...vedtaksperiode,
                forlengelseFraInfotrygd: true,
                periodetype: Periodetype.Infotrygdforlengelse,
                rawData: { ...vedtaksperiode.rawData, førsteFraværsdag: '2019-10-06' },
            };
            render(<VilkårWrapper vedtaksperiode={aktivVedtaksperiode} />);

            expect(vilkårTilVurdering()).toBeInTheDocument();
            expect(automatiskVurderteVilkår()).toBeInTheDocument();
            expect(behandletInnhold()).not.toBeInTheDocument();
            expect(behandletAvInfotrygd()).toBeInTheDocument();
        });
        test('ubehandlet infotrygd skal ha automatisk vurderte vilkår, vilkår til vurdering og behandlet av infotrygd', () => {
            const aktivVedtaksperiode = {
                ...enSpeilVedtaksperiode(),
                forlengelseFraInfotrygd: true,
            };
            render(<VilkårWrapper vedtaksperiode={aktivVedtaksperiode} />);

            expect(vilkårTilVurdering()).toBeInTheDocument();
            expect(automatiskVurderteVilkår()).toBeInTheDocument();
            expect(behandletInnhold()).not.toBeInTheDocument();
            expect(behandletAvInfotrygd()).toBeInTheDocument();
        });
    });

    describe('behandlet - ', () => {
        test('behandlet skal ha behandlet innhold', () => {
            const vedtaksperiode = enSpeilVedtaksperiode();
            const aktivVedtaksperiode = {
                ...vedtaksperiode,
                rawData: {
                    ...vedtaksperiode.rawData,
                    godkjentAv: 'Sak Sbeh Andler',
                    godkjenttidspunkt: '2020-05-01',
                },
            };
            render(<VilkårWrapper vedtaksperiode={aktivVedtaksperiode} />);

            expect(vilkårTilVurdering()).not.toBeInTheDocument();
            expect(automatiskVurderteVilkår()).not.toBeInTheDocument();
            expect(behandletInnhold()).toBeInTheDocument();
            expect(behandletAvInfotrygd()).not.toBeInTheDocument();
        });
        test('behandlet påfølgende skal ha behandlet innhold', () => {
            const vedtaksperiode = enSpeilVedtaksperiode();
            const aktivVedtaksperiode = {
                ...vedtaksperiode,
                rawData: {
                    ...vedtaksperiode.rawData,
                    godkjentAv: 'Sak Sbeh Andler',
                    godkjenttidspunkt: '2020-05-01',
                    førsteFraværsdag: '2019-10-06',
                },
            };
            render(<VilkårWrapper vedtaksperiode={aktivVedtaksperiode} />);

            expect(vilkårTilVurdering()).not.toBeInTheDocument();
            expect(automatiskVurderteVilkår()).not.toBeInTheDocument();
            expect(behandletInnhold()).toBeInTheDocument();
            expect(behandletAvInfotrygd()).not.toBeInTheDocument();
        });
        test('behandlet infotrygd skal ha behandlet innhold og behandlet av infotrygd', () => {
            const vedtaksperiode = enSpeilVedtaksperiode();
            const aktivVedtaksperiode = {
                ...vedtaksperiode,
                forlengelseFraInfotrygd: true,
                rawData: {
                    ...vedtaksperiode.rawData,
                    godkjentAv: 'Sak Sbeh Andler',
                    godkjenttidspunkt: '2020-05-01',
                },
            };
            render(<VilkårWrapper vedtaksperiode={aktivVedtaksperiode} />);

            expect(vilkårTilVurdering()).not.toBeInTheDocument();
            expect(automatiskVurderteVilkår()).not.toBeInTheDocument();
            expect(behandletInnhold()).toBeInTheDocument();
            expect(behandletAvInfotrygd()).toBeInTheDocument();
        });
        test('behandlet påfølgende infotrygd skal ha behandlet innhold og behandlet av infotrygd', () => {
            const vedtaksperiode = enSpeilVedtaksperiode();
            const aktivVedtaksperiode = {
                ...vedtaksperiode,
                forlengelseFraInfotrygd: true,
                rawData: {
                    ...vedtaksperiode.rawData,
                    godkjentAv: 'Sak Sbeh Andler',
                    godkjenttidspunkt: '2020-05-01',
                    førsteFraværsdag: '2019-10-06',
                },
            };
            render(<VilkårWrapper vedtaksperiode={aktivVedtaksperiode} />);

            expect(vilkårTilVurdering()).not.toBeInTheDocument();
            expect(automatiskVurderteVilkår()).not.toBeInTheDocument();
            expect(behandletInnhold()).toBeInTheDocument();
            expect(behandletAvInfotrygd()).toBeInTheDocument();
        });
    });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Sykepengegrunnlag } from './Sykepengegrunnlag';
import { mappetPerson, mappetVedtaksperiode } from 'test-data';
import '../../../tekster';
import { Periodetype } from 'internal-types';
import { mappetInntektsgrunnlag, umappetInntektsgrunnlag } from '../../../../test/data/inntektsgrunnlag';
import { SpesialistInntektkilde } from 'external-types';
import { RecoilRoot } from 'recoil';
import { anonymiserPersonState } from '../../../state/person';

const enPerson = mappetPerson();
const enVedtaksperiodeIM = mappetVedtaksperiode();
const enVedtaksperiodeIT = mappetVedtaksperiode(undefined, undefined, undefined, [
    umappetInntektsgrunnlag(SpesialistInntektkilde.Infotrygd),
]);

const expectContainsStandardFields = () => {
    expect(screen.queryByText('Inntekt')).toBeVisible();
    expect(screen.queryByText('Fra Inntektsmelding')).toBeVisible();
};

const expectContainsStandardFieldsInfotrygd = () => {
    expect(screen.queryByText('Sykepengegrunnlag satt i Infotrygd')).toBeVisible();
    expect(screen.queryByText('Inntekt')).toBeVisible();
    expect(screen.queryByText('Inntektsgrunnlag')).toBeVisible();
    expect(screen.queryByText('Sammenligningsgrunnlag')).toBeNull();
};

describe('Sykepengegrunnlag', () => {
    test('rendrer ubehandlet sykepengegrunnlag', () => {
        render(
            <RecoilRoot initializeState={({ set }) => set(anonymiserPersonState, false)}>
                <Sykepengegrunnlag vedtaksperiode={enVedtaksperiodeIM} person={enPerson} />
            </RecoilRoot>
        );
        expect(screen.queryByText('Sykepengegrunnlag satt ved skjæringstidspunkt - 01.01.2020')).toBeNull();
        expectContainsStandardFields();
    });
    test('rendrer behandlet sykepengegrunnlag for førstegangssak', () => {
        const behandletPeriode = {
            ...enVedtaksperiodeIM,
            periodetype: Periodetype.Førstegangsbehandling,
            behandlet: true,
        };
        render(
            <RecoilRoot initializeState={({ set }) => set(anonymiserPersonState, false)}>
                <Sykepengegrunnlag vedtaksperiode={behandletPeriode} person={enPerson} />
            </RecoilRoot>
        );
        expect(screen.queryByText('Sykepengegrunnlag satt ved skjæringstidspunkt - 01.01.2020')).toBeVisible();
        expectContainsStandardFields();
    });
    test('rendrer behandlet sykepengegrunnlag for forlengelse', () => {
        const behandletPeriode = {
            ...enVedtaksperiodeIT,
            inntektsgrunnlag: mappetInntektsgrunnlag,
            periodetype: Periodetype.Forlengelse,
            behandlet: true,
        };
        render(
            <RecoilRoot initializeState={({ set }) => set(anonymiserPersonState, false)}>
                <Sykepengegrunnlag vedtaksperiode={behandletPeriode} person={enPerson} />
            </RecoilRoot>
        );
        expect(screen.queryByText('Sykepengegrunnlag satt ved skjæringstidspunkt - 01.01.2020')).toBeVisible();
        expectContainsStandardFields();
    });
    test('rendrer behandlet sykepengegrunnlag for infotrygdforlengelser', () => {
        const behandletPeriode = {
            ...enVedtaksperiodeIT,
            periodetype: Periodetype.Infotrygdforlengelse,
            behandlet: true,
        };
        render(
            <RecoilRoot initializeState={({ set }) => set(anonymiserPersonState, false)}>
                <Sykepengegrunnlag vedtaksperiode={behandletPeriode} person={enPerson} />
            </RecoilRoot>
        );
        expectContainsStandardFieldsInfotrygd();
    });
    test('rendrer ubehandlet sykepengegrunnlag for infotrygdforlengelser', () => {
        const behandletPeriode = {
            ...enVedtaksperiodeIT,
            periodetype: Periodetype.Infotrygdforlengelse,
            behandlet: false,
        };
        render(
            <RecoilRoot initializeState={({ set }) => set(anonymiserPersonState, false)}>
                <Sykepengegrunnlag vedtaksperiode={behandletPeriode} person={enPerson} />
            </RecoilRoot>
        );
        expectContainsStandardFieldsInfotrygd();
    });
});

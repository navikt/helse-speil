import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { SpesialistInntektkilde } from 'external-types';
import { Periodetype } from 'internal-types';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { mappetPerson, mappetVedtaksperiode } from 'test-data';

import { persondataSkalAnonymiseres } from '../../../state/person';

import { mappetInntektsgrunnlag, umappetInntektsgrunnlag } from '../../../../test/data/inntektsgrunnlag';
import '../../../tekster';
import { Sykepengegrunnlag } from './Sykepengegrunnlag';

const enPerson = mappetPerson();
const enVedtaksperiodeIM = mappetVedtaksperiode();
const enVedtaksperiodeIT = mappetVedtaksperiode(undefined, undefined, undefined, [
    umappetInntektsgrunnlag(SpesialistInntektkilde.Infotrygd),
]);

const expectContainsStandardFields = () => {
    expect(screen.queryByText('Inntekt')).toBeVisible();
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
            <RecoilRoot initializeState={({ set }) => set(persondataSkalAnonymiseres, false)}>
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
            <RecoilRoot initializeState={({ set }) => set(persondataSkalAnonymiseres, false)}>
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
            <RecoilRoot initializeState={({ set }) => set(persondataSkalAnonymiseres, false)}>
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
            <RecoilRoot initializeState={({ set }) => set(persondataSkalAnonymiseres, false)}>
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
            <RecoilRoot initializeState={({ set }) => set(persondataSkalAnonymiseres, false)}>
                <Sykepengegrunnlag vedtaksperiode={behandletPeriode} person={enPerson} />
            </RecoilRoot>
        );
        expectContainsStandardFieldsInfotrygd();
    });
});

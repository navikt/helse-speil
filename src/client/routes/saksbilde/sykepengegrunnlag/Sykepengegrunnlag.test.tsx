import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { SpesialistInntektkilde } from 'external-types';
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

const wrapper: React.FC = ({ children }) => (
    <RecoilRoot initializeState={({ set }) => set(persondataSkalAnonymiseres, false)}>{children}</RecoilRoot>
);

describe('Sykepengegrunnlag', () => {
    test('rendrer ubehandlet sykepengegrunnlag', () => {
        render(<Sykepengegrunnlag vedtaksperiode={enVedtaksperiodeIM} person={enPerson} />, { wrapper });
        expect(screen.queryByText('Sykepengegrunnlag satt ved skjæringstidspunkt - 01.01.2020')).toBeNull();
        expectContainsStandardFields();
    });
    test('rendrer behandlet sykepengegrunnlag for førstegangssak', () => {
        const behandletPeriode: Vedtaksperiode = {
            ...enVedtaksperiodeIM,
            periodetype: 'førstegangsbehandling',
            behandlet: true,
        };
        render(<Sykepengegrunnlag vedtaksperiode={behandletPeriode} person={enPerson} />, { wrapper });
        expect(screen.queryByText('Sykepengegrunnlag satt ved skjæringstidspunkt - 01.01.2020')).toBeVisible();
        expectContainsStandardFields();
    });
    test('rendrer behandlet sykepengegrunnlag for forlengelse', () => {
        const behandletPeriode: Vedtaksperiode = {
            ...enVedtaksperiodeIT,
            inntektsgrunnlag: mappetInntektsgrunnlag,
            periodetype: 'forlengelse',
            behandlet: true,
        };
        render(<Sykepengegrunnlag vedtaksperiode={behandletPeriode} person={enPerson} />, { wrapper });
        expect(screen.queryByText('Sykepengegrunnlag satt ved skjæringstidspunkt - 01.01.2020')).toBeVisible();
        expectContainsStandardFields();
    });
    test('rendrer behandlet sykepengegrunnlag for infotrygdforlengelser', () => {
        const behandletPeriode: Vedtaksperiode = {
            ...enVedtaksperiodeIT,
            periodetype: 'infotrygdforlengelse',
            behandlet: true,
        };
        render(<Sykepengegrunnlag vedtaksperiode={behandletPeriode} person={enPerson} />, { wrapper });
        expectContainsStandardFieldsInfotrygd();
    });
    test('rendrer ubehandlet sykepengegrunnlag for infotrygdforlengelser', () => {
        const behandletPeriode: Vedtaksperiode = {
            ...enVedtaksperiodeIT,
            periodetype: 'infotrygdforlengelse',
            behandlet: false,
        };
        render(<Sykepengegrunnlag vedtaksperiode={behandletPeriode} person={enPerson} />, { wrapper });
        expectContainsStandardFieldsInfotrygd();
    });
});

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {Sykepengegrunnlag} from './Sykepengegrunnlag';
import {mappetPerson, mappetVedtaksperiode} from 'test-data';
import '../../../tekster';
import {Periodetype} from 'internal-types';
import {mappetInntektsgrunnlag, umappetInntektsgrunnlag} from '../../../../test/data/inntektsgrunnlag'
import {SpesialistInntektkilde} from "external-types";

const enPerson = mappetPerson();
const enVedtaksperiodeIM = mappetVedtaksperiode();
const enVedtaksperiodeIT = mappetVedtaksperiode(undefined, undefined, undefined, [umappetInntektsgrunnlag(SpesialistInntektkilde.Infotrygd)]);

const expectContainsStandardFields = () => {
    expect(screen.queryByText('Inntekt')).toBeVisible();
    expect(screen.queryByText('Fra Inntektsmelding')).toBeVisible();
};

// TODO: revurder etter avklaring fra Nina på skisser 
const expectContainsStandardFieldsInfotrygd = () => {
    expect(screen.queryByText('Sykepengegrunnlag satt i Infotrygd')).toBeVisible();
    expect(screen.queryByText('Inntekt')).toBeVisible();
    expect(screen.queryByText('Inntektsgrunnlag')).toBeNull();
    expect(screen.queryByText('Sammenligningsgrunnlag')).toBeNull();
};

describe('Sykepengegrunnlag', () => {
    test('rendrer ubehandlet sykepengegrunnlag', () => {
        render(<Sykepengegrunnlag vedtaksperiode={enVedtaksperiodeIM} person={enPerson} />);
        expect(screen.queryByText('Sykepengegrunnlag satt ved skjæringstidspunkt - 01.01.2020')).toBeNull();
        expectContainsStandardFields();
    });
    test('rendrer behandlet sykepengegrunnlag for førstegangssak', () => {
        const behandletPeriode = {
            ...enVedtaksperiodeIM,
            periodetype: Periodetype.Førstegangsbehandling,
            behandlet: true,
        };
        render(<Sykepengegrunnlag vedtaksperiode={behandletPeriode} person={enPerson} />);
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
        render(<Sykepengegrunnlag vedtaksperiode={behandletPeriode} person={enPerson} />);
        expect(screen.queryByText('Sykepengegrunnlag satt ved skjæringstidspunkt - 01.01.2020')).toBeVisible();
        expectContainsStandardFields();
    });
    test('rendrer behandlet sykepengegrunnlag for infotrygdforlengelser', () => {
        const behandletPeriode = {
            ...enVedtaksperiodeIT,
            periodetype: Periodetype.Infotrygdforlengelse,
            behandlet: true,
        };
        render(<Sykepengegrunnlag vedtaksperiode={behandletPeriode} person={enPerson} />);
        expectContainsStandardFieldsInfotrygd();
    });
    test('rendrer ubehandlet sykepengegrunnlag for infotrygdforlengelser', () => {
        const behandletPeriode = {
            ...enVedtaksperiodeIT,
            periodetype: Periodetype.Infotrygdforlengelse,
            behandlet: false,
        };
        render(<Sykepengegrunnlag vedtaksperiode={behandletPeriode} person={enPerson} />);
        expectContainsStandardFieldsInfotrygd();
    });
});

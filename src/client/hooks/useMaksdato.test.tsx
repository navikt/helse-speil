import React from 'react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import '@testing-library/jest-dom/extend-expect';
import { useMaksdato } from './useMaksdato';
import { mappetPerson, vedtaksperiodeMedMaksdato } from '../context/mapping/testdata/mappetPerson';
import { Vedtaksperiode } from '../context/types.internal';
import { cleanup, render, screen } from '@testing-library/react';
import { NORSK_DATOFORMAT } from '../utils/date';
import { defaultPersonContext, PersonContext } from '../context/PersonContext';

afterEach(cleanup);

dayjs.extend(isSameOrAfter);

const defaultVedtaksperiode = mappetPerson.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode;

const PersonProvider: React.FC<{ aktivVedtaksperiode?: Vedtaksperiode }> = ({
    children,
    aktivVedtaksperiode = defaultVedtaksperiode,
}) => {
    return (
        <PersonContext.Provider value={{ ...defaultPersonContext, aktivVedtaksperiode }}>
            {children}
        </PersonContext.Provider>
    );
};

const Consumer = () => {
    const { maksdato, maksdatoOverskrides } = useMaksdato();

    return (
        <>
            <div data-testid="maksdato">{maksdato?.format(NORSK_DATOFORMAT)}</div>
            <div data-testid="maksdato-overskrides">{!!maksdatoOverskrides && 'Maksdato overskrides'}</div>
        </>
    );
};

describe('useMaksdato', () => {
    test('finner riktig maksdato', () => {
        render(
            <PersonProvider>
                <Consumer />
            </PersonProvider>
        );
        const maksdato = screen.getByTestId('maksdato');
        const maksdatoOverskrides = screen.getByTestId('maksdato-overskrides');
        expect(maksdato).toHaveTextContent('07.09.2020');
        expect(maksdatoOverskrides).toBeEmpty();
    });
    test('viser at maksdato overskrides', () => {
        render(
            <PersonProvider aktivVedtaksperiode={vedtaksperiodeMedMaksdato(dayjs('2010-01-01'))}>
                <Consumer />
            </PersonProvider>
        );
        const maksdatoOverskrides = screen.getByTestId('maksdato-overskrides');
        expect(maksdatoOverskrides).toHaveTextContent('Maksdato overskrides');
    });
});

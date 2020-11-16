import React from 'react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import '@testing-library/jest-dom/extend-expect';
import { useMaksdato } from './useMaksdato';
import { Vedtaksperiode } from 'internal-types';
import { cleanup, render, screen } from '@testing-library/react';
import { NORSK_DATOFORMAT } from '../utils/date';
import { defaultPersonContext, PersonContext } from '../context/PersonContext';
import { mappetPerson } from '../mapping/testdata/mappetPerson';

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
    const { maksdato } = useMaksdato();

    return (
        <>
            <div data-testid="maksdato">{maksdato?.format(NORSK_DATOFORMAT)}</div>
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
        expect(maksdato).toHaveTextContent('07.10.2020');
    });
});

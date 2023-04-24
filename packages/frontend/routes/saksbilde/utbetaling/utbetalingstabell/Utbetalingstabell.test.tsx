import { RecoilWrapper } from '@test-wrappers';
import React from 'react';

import { Kildetype } from '@io/graphql';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import { Utbetalingstabell } from './Utbetalingstabell';

jest.mock('./useAlderVedSkjæringstidspunkt', () => ({
    useAlderVedSkjæringstidspunkt: () => 30,
}));

const enUtbetalingstabelldag = (dato: string, overrides?: Partial<UtbetalingstabellDag>): UtbetalingstabellDag => ({
    dato: dato,
    kilde: { id: 'Sasdadgf', type: Kildetype.Inntektsmelding },
    type: 'Syk',
    erAGP: false,
    erAvvist: false,
    erForeldet: false,
    erMaksdato: false,
    grad: 100,
    dagerIgjen: 100,
    overstyringer: [],
    totalGradering: 100,
    arbeidsgiverbeløp: 999,
    personbeløp: 1234,
    begrunnelser: [],
    ...overrides,
});

const dager = new Map<string, UtbetalingstabellDag>([
    ['2022-01-01', enUtbetalingstabelldag('2022-01-01')],
    ['2022-01-02', enUtbetalingstabelldag('2022-01-02')],
    ['2022-01-03', enUtbetalingstabelldag('2022-01-03')],
    ['2022-01-04', enUtbetalingstabelldag('2022-01-04')],
    ['2022-01-05', enUtbetalingstabelldag('2022-01-05')],
]);

describe('Utbetalingstabell', () => {
    it('rendrer headere, totalrad og dagrader', () => {
        render(<Utbetalingstabell fom="2021-01-01" tom="2021-01-10" dager={dager} />, { wrapper: RecoilWrapper });

        expect(screen.getAllByRole('row')).toHaveLength(7);
    });
});

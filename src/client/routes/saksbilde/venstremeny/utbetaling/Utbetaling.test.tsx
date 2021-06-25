import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { Tidslinjetilstand } from 'internal-types';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { RecoilRoot } from 'recoil';
import { enTidslinjeperiode, mappetPerson } from 'test-data';

import { Periodetype, Tidslinjeperiode } from '../../../../modell/UtbetalingshistorikkElement';
import { personState } from '../../../../state/person';

import '../../../../tekster';
import { Utbetaling } from './Utbetaling';
import { Avvisningsskjema } from './Utbetalingsdialog';

const UtbetalingView = ({ aktivPeriode }: { aktivPeriode: Tidslinjeperiode }) => {
    return (
        <RecoilRoot
            initializeState={({ set }) => {
                set(personState, { person: mappetPerson() });
            }}
        >
            <MemoryRouter>
                <Utbetaling aktivPeriode={aktivPeriode} />
            </MemoryRouter>
        </RecoilRoot>
    );
};

jest.mock('../../../../io/http', () => ({
    postVedtak: async (_godkjent: boolean, _skjema?: Avvisningsskjema) => Promise.resolve(),
}));

describe('Utbetalingsknapp vises ikke ved tilstand:', () => {
    test('Utbetalt', async () => {
        render(<UtbetalingView aktivPeriode={enTidslinjeperiode(Tidslinjetilstand.Utbetalt)} />);
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    test('Avslag', async () => {
        render(<UtbetalingView aktivPeriode={enTidslinjeperiode(Tidslinjetilstand.Avslag)} />);
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });
});

describe('Utbetalingsknapp ved revurdering:', () => {
    test('Utbetalt', async () => {
        render(
            <UtbetalingView
                aktivPeriode={enTidslinjeperiode(
                    Tidslinjetilstand.Revurderes,
                    dayjs('2021-01-01'),
                    dayjs('2021-01-31'),
                    Periodetype.REVURDERING
                )}
            />
        );
        expect(screen.queryAllByRole('button')).toHaveLength(1);
        expect(screen.getByText('Revurder')).toHaveTextContent('Revurder');
    });
});

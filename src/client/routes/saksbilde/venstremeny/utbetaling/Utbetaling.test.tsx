import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { RecoilRoot } from 'recoil';
import { mappetPerson } from 'test-data';

import { Tidslinjetilstand } from '../../../../mapping/arbeidsgiver';
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

const enTidslinjeperiode = (
    tilstand: Tidslinjetilstand = Tidslinjetilstand.Oppgaver,
    fom: Dayjs = dayjs('2021-01-01'),
    tom: Dayjs = dayjs('2021-01-31'),
    periodetype: Periodetype = Periodetype.VEDTAKSPERIODE
): Tidslinjeperiode => {
    return {
        id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
        beregningId: 'id1',
        unique: 'unique_id',
        fom: fom,
        tom: tom,
        type: periodetype,
        tilstand: tilstand,
        utbetalingstidslinje: [],
        sykdomstidslinje: [],
        organisasjonsnummer: '987654321',
        fullstendig: true,
        opprettet: dayjs('2020-01-01T:00:00:00'),
    };
};

jest.mock('../../../../../io/http', () => ({
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

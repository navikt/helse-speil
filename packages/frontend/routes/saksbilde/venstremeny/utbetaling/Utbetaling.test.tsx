import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { enTidslinjeperiode, mappetPerson } from 'test-data';

import { personState } from '@state/utbetaling';

import '../../../../tekster';
import { Utbetaling } from './Utbetaling';
import { Avvisningsskjema } from './AvvisningModal';
import { testBeregningId, testVilkårsgrunnlagHistorikkId } from '../../../../test/data/person';

jest.mock('@utils/featureToggles', () => ({
    erDev: () => false,
    erLocal: () => false,
}));

const wrapper =
    (initializer?: (mutableSnapshot: MutableSnapshot) => void): React.FC =>
    ({ children }) =>
        (
            <RecoilRoot initializeState={initializer}>
                <MemoryRouter>{children}</MemoryRouter>
            </RecoilRoot>
        );

const wrapperMedPerson = (personProperties?: Partial<Person>) =>
    wrapper(({ set }) => {
        set(personState, {
            person: {
                ...mappetPerson(),
                vilkårsgrunnlagHistorikk: {},
                arbeidsgivereV2: [],
                arbeidsforhold: [],
                ...personProperties,
            },
        });
    });

jest.mock('../../../../io/http', () => ({
    postVedtak: async (_godkjent: boolean, _skjema?: Avvisningsskjema) => Promise.resolve(),
}));

describe('Utbetaling', () => {
    test('viser ikke utbetalingsknapp ved tilstand "Utbetalt"', () => {
        render(<Utbetaling activePeriod={enTidslinjeperiode('utbetalt')} />, { wrapper: wrapperMedPerson() });
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    test('viser ikke utbetalingsknapp ved tilstand "Avslag"', () => {
        render(<Utbetaling activePeriod={enTidslinjeperiode('avslag')} />, { wrapper: wrapperMedPerson() });
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    test('viser revurderingsknapp ved tilstand "Revurdering"', () => {
        render(
            <Utbetaling
                activePeriod={enTidslinjeperiode('revurderes', dayjs('2021-01-01'), dayjs('2021-01-31'), 'REVURDERING')}
            />,
            { wrapper: wrapperMedPerson() },
        );
        expect(screen.queryAllByRole('button')).toHaveLength(1);
        expect(screen.getByText('Revurder')).toHaveTextContent('Revurder');
    });
});

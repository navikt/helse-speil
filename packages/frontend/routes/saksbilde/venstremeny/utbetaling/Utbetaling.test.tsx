import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { enTidslinjeperiode, mappetPerson } from 'test-data';

import { personState } from '../../../../state/person';

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
        render(<Utbetaling aktivPeriode={enTidslinjeperiode('utbetalt')} />, { wrapper: wrapperMedPerson() });
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    test('viser ikke utbetalingsknapp ved tilstand "Avslag"', () => {
        render(<Utbetaling aktivPeriode={enTidslinjeperiode('avslag')} />, { wrapper: wrapperMedPerson() });
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    test('viser revurderingsknapp ved tilstand "Revurdering"', () => {
        render(
            <Utbetaling
                aktivPeriode={enTidslinjeperiode('revurderes', dayjs('2021-01-01'), dayjs('2021-01-31'), 'REVURDERING')}
            />,
            { wrapper: wrapperMedPerson() }
        );
        expect(screen.queryAllByRole('button')).toHaveLength(1);
        expect(screen.getByText('Revurder')).toHaveTextContent('Revurder');
    });

    test('viser ikke utbetalingsknapp når det finnes brukerutbetalinger', () => {
        const person = mappetPerson();
        const personMedBrukerutbetaling: Person = {
            ...person,
            arbeidsgivere: [
                {
                    ...person.arbeidsgivere[0],
                    utbetalingshistorikk: [
                        {
                            id: testBeregningId,
                            vilkårsgrunnlaghistorikkId: testVilkårsgrunnlagHistorikkId,
                            beregnettidslinje: [],
                            hendelsetidslinje: [],
                            utbetaling: {
                                status: 'IKKE_UTBETALT',
                                type: 'UTBETALING',
                                utbetalingstidslinje: [],
                                maksdato: dayjs().add(200, 'day'),
                                gjenståendeDager: 200,
                                forbrukteDager: 10,
                                arbeidsgiverNettobeløp: 0,
                                arbeidsgiverFagsystemId: 'en-arbeidsgiver-fagsystemid',
                                personNettobeløp: 54321,
                                personFagsystemId: 'en-person-fagsystemid',
                            },
                            kilde: 'en-kilde',
                            tidsstempel: dayjs(),
                        },
                    ],
                },
            ],
        };
        render(<Utbetaling aktivPeriode={enTidslinjeperiode()} />, {
            wrapper: wrapperMedPerson(personMedBrukerutbetaling),
        });

        expect(screen.queryByTestId('godkjenning-button')).toBeNull();
    });
});

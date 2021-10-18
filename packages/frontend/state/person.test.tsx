import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { mappetPerson } from 'test-data';

import { umappetArbeidsgiver } from '../test/data/arbeidsgiver';
import { testBeregningId, testSkjæringstidspunkt, testVilkårsgrunnlagHistorikkId } from '../test/data/person';
import { umappetUtbetalingshistorikk } from '../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../test/data/vedtaksperiode';
import { etSpleisgrunnlag } from '../test/data/vilkårsgrunnlaghistorikk';
import { personState, useVilkårsgrunnlaghistorikk } from './person';

const personActual = jest.requireActual('./person');

const wrapper =
    (initializer?: (mutableSnapshot: MutableSnapshot) => void): React.FC =>
    ({ children }) =>
        <RecoilRoot initializeState={initializer}>{children}</RecoilRoot>;

const person = mappetPerson([
    umappetArbeidsgiver(
        [
            umappetVedtaksperiode({
                id: 'uuid-1',
                fom: '2018-01-01',
                tom: '2018-01-31',
            }),
            umappetVedtaksperiode({
                id: 'uuid-2',
                fom: '2018-02-01',
                tom: '2018-02-14',
            }),
        ],
        [],
        [umappetUtbetalingshistorikk(testBeregningId, 'REVURDERING')]
    ),
]);

jest.mock('nanoid', () => ({
    nanoid: () => 'nanoid',
}));

describe('vilkårsgrunnlagHook', () => {
    it('finner vilkårsgrunnlag', () => {
        const { result } = renderHook(
            () => useVilkårsgrunnlaghistorikk(testSkjæringstidspunkt, testVilkårsgrunnlagHistorikkId),
            {
                wrapper: wrapper(({ set }) => {
                    set(personState, {
                        person: {
                            ...mappetPerson(),
                            vilkårsgrunnlagHistorikk: {
                                [testVilkårsgrunnlagHistorikkId]: {
                                    [testSkjæringstidspunkt]: etSpleisgrunnlag({
                                        skjæringstidspunkt: testSkjæringstidspunkt,
                                    }),
                                },
                            },
                            arbeidsgivereV2: [],
                            arbeidsforhold: [],
                        },
                    });
                }),
            }
        );
        expect(result.current?.skjæringstidspunkt).toEqual(testSkjæringstidspunkt);
    });

    it('finner ikke vilkårsgrunnlag', () => {
        const { result } = renderHook(() => useVilkårsgrunnlaghistorikk('2020-01-01', testVilkårsgrunnlagHistorikkId), {
            wrapper: wrapper(({ set }) => {
                set(personState, {
                    person: {
                        ...mappetPerson(),
                        vilkårsgrunnlagHistorikk: {},
                        arbeidsgivereV2: [],
                        arbeidsforhold: [],
                    },
                });
            }),
        });
        expect(result.current).toBeNull();
    });
});

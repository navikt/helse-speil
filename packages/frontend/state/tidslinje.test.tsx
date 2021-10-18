import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { mappetPerson } from 'test-data';

import { umappetArbeidsgiver } from '../test/data/arbeidsgiver';
import { testBeregningId, testVedtaksperiodeId } from '../test/data/person';
import { umappetUtbetalingshistorikk } from '../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../test/data/vedtaksperiode';
import { aktivPeriodeState, useMaybeAktivPeriode } from './tidslinje';

const wrapper =
    (initializer?: (mutableSnapshot: MutableSnapshot) => void): React.FC =>
    ({ children }) =>
        <RecoilRoot initializeState={initializer}>{children}</RecoilRoot>;

const person = mappetPerson([
    umappetArbeidsgiver(
        [
            umappetVedtaksperiode({
                id: testVedtaksperiodeId,
                beregningIder: [testBeregningId],
                fom: '2020-01-01',
                tom: '2020-01-31',
            }),
            umappetVedtaksperiode({
                id: 'uuid-2',
                beregningIder: ['id2'],
                fom: '2020-02-01',
                tom: '2020-02-14',
            }),
        ],
        [],
        [umappetUtbetalingshistorikk(testBeregningId, 'UTBETALING'), umappetUtbetalingshistorikk('id2', 'UTBETALING')]
    ),
]);

jest.mock('./person', () => ({
    usePerson: () => person,
}));

jest.mock('nanoid', () => ({
    nanoid: () => 'nanoid',
}));

describe('tidslinjehook', () => {
    it('defaulter til siste periode om ikke en er aktiv', () => {
        const { result } = renderHook(() => useMaybeAktivPeriode(), { wrapper: wrapper() });
        expect(result.current?.id).toEqual('uuid-2');
    });

    it('finner periode', () => {
        const { result } = renderHook(() => useMaybeAktivPeriode(), {
            wrapper: wrapper(({ set }) => {
                set(aktivPeriodeState, `${testVedtaksperiodeId}+${testBeregningId}+nanoid`);
            }),
        });
        const { id, beregningId, unique } = result.current as Tidslinjeperiode;
        expect(id).toEqual(testVedtaksperiodeId);
        expect(beregningId).toEqual(testBeregningId);
        expect(unique).toEqual('nanoid');
    });
});

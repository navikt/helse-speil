import { renderHook } from '@testing-library/react-hooks';
import dayjs from 'dayjs';
import React from 'react';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { mappetPerson } from 'test-data';

import { Tidslinjeperiode } from '../modell/UtbetalingshistorikkElement';

import { umappetArbeidsgiver } from '../../test/data/arbeidsgiver';
import { umappetUtbetalingshistorikk } from '../../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../../test/data/vedtaksperiode';
import { aktivPeriodeState, decomposedId, useAktivPeriode, useAktivVedtaksperiode } from './tidslinje';

const wrapper: React.FC = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;
const person = mappetPerson([
    umappetArbeidsgiver(
        [
            umappetVedtaksperiode({
                id: 'uuid-1',
                fom: dayjs('2020-01-01'),
                tom: dayjs('2020-01-31'),
            }),
            umappetVedtaksperiode({
                id: 'uuid-2',
                beregningIder: ['id2'],
                fom: dayjs('2020-02-01'),
                tom: dayjs('2020-02-14'),
            }),
        ],
        [],
        [umappetUtbetalingshistorikk('id1', false), umappetUtbetalingshistorikk('id2', false)]
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
        const { result } = renderHook(
            () => {
                return useAktivVedtaksperiode();
            },
            { wrapper }
        );
        expect(result.current?.id).toEqual('uuid-2');
    });

    it('finner periode', () => {
        const { result } = renderHook(
            () => {
                useSetRecoilState(aktivPeriodeState)('uuid-1+id1+nanoid');
                return useAktivPeriode();
            },
            { wrapper }
        );
        const { id, beregningId, unique } = result.current as Tidslinjeperiode;
        expect(id).toEqual('uuid-1');
        expect(beregningId).toEqual('id1');
        expect(unique).toEqual('nanoid');
    });
});

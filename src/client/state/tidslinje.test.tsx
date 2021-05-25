import { renderHook } from '@testing-library/react-hooks';
import dayjs from 'dayjs';
import React from 'react';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { mappetPerson } from 'test-data';

import { umappetArbeidsgiver } from '../../test/data/arbeidsgiver';
import { umappetUtbetalingshistorikk } from '../../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../../test/data/vedtaksperiode';
import { aktivPeriodeState, useAktivPeriode, useAktivVedtaksperiode } from './tidslinje';

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
                fom: dayjs('2020-02-01'),
                tom: dayjs('2020-02-14'),
            }),
        ],
        [],
        [umappetUtbetalingshistorikk('id1', true)]
    ),
]);

jest.mock('./person', () => ({
    usePerson: () => person,
}));

jest.mock('nanoid', () => ({
    nanoid: () => 'nanoid',
}));

describe('tidslinjehook', () => {
    it('defaulter til siste vedtaksperiode om ikke en er aktiv', () => {
        const { result } = renderHook(
            () => {
                return useAktivVedtaksperiode();
            },
            { wrapper }
        );
        expect(result.current?.id).toEqual('uuid-2');
    });

    it('defaulter til siste vedtaksperiode om ikke en er aktiv', () => {
        const { result } = renderHook(
            () => {
                useSetRecoilState(aktivPeriodeState)('uuid-1');
                return useAktivVedtaksperiode();
            },
            { wrapper }
        );
        expect(result.current?.id).toEqual('uuid-1');
    });

    it('finner revurdert periode', () => {
        const { result } = renderHook(
            () => {
                useSetRecoilState(aktivPeriodeState)('nanoid');
                return useAktivPeriode();
            },
            { wrapper }
        );
        expect(result.current?.id).toEqual('nanoid');
    });

    it('finner vedtaksperiode via aktivPeriode', () => {
        const { result } = renderHook(
            () => {
                useSetRecoilState(aktivPeriodeState)('uuid-2');
                return useAktivPeriode();
            },
            { wrapper }
        );
        expect(result.current?.id).toEqual('uuid-2');
    });
});

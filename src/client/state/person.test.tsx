import { renderHook } from '@testing-library/react-hooks';
import dayjs from 'dayjs';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { mappetPerson } from 'test-data';

import { umappetArbeidsgiver } from '../../test/data/arbeidsgiver';
import { umappetUtbetalingshistorikk } from '../../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../../test/data/vedtaksperiode';

const personActual = jest.requireActual('./person');

const wrapper: React.FC = ({ children }) => <RecoilRoot>{children} </RecoilRoot>;
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

jest.mock('nanoid', () => ({
    nanoid: () => 'nanoid',
}));

describe('sykepengrunnlagHook', () => {
    it('henter sykepengegrunnlag', () => {
        personActual.usePerson = jest.fn(() => person);
        const { result } = renderHook(
            () => {
                return personActual.useSykepengegrunnlag('id1');
            },
            { wrapper }
        );
        expect(result.current?.sykepengegrunnlag).toEqual(372000);
    });
});

import { renderHook } from '@testing-library/react-hooks';
import dayjs from 'dayjs';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { mappetPerson } from 'test-data';

import { umappetArbeidsgiver } from '../../test/data/arbeidsgiver';
import { umappetUtbetalingshistorikk } from '../../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../../test/data/vedtaksperiode';
import { etSpleisgrunnlag } from '../../test/data/vilkårsgrunnlaghistorikk';
import { personState, useVilkårsgrunnlaghistorikk } from './person';

const personActual = jest.requireActual('./person');

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
        [umappetUtbetalingshistorikk('id1', 'REVURDERING')]
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

describe('vilkårsgrunnlagHook', () => {
    it('finner vilkårsgrunnlag', () => {
        const { result } = renderHook(() => useVilkårsgrunnlaghistorikk('2020-10-21', 'id1'), {
            wrapper: ({ children }) => (
                <RecoilRoot
                    initializeState={({ set }) => {
                        set(personState, {
                            person: {
                                ...mappetPerson(),
                                vilkårsgrunnlagHistorikk: {
                                    id1: { '2020-10-21': etSpleisgrunnlag({ skjæringstidspunkt: '2020-10-21' }) },
                                },
                            },
                        });
                    }}
                >
                    {children}
                </RecoilRoot>
            ),
        });
        expect(result.current?.skjæringstidspunkt).toEqual('2020-10-21');
    });

    it('finner ikke vilkårsgrunnlag', () => {
        const { result } = renderHook(() => useVilkårsgrunnlaghistorikk('2020-01-01', 'id1'), {
            wrapper: ({ children }) => (
                <RecoilRoot
                    initializeState={({ set }) => {
                        set(personState, {
                            person: {
                                ...mappetPerson(),
                                vilkårsgrunnlagHistorikk: {},
                            },
                        });
                    }}
                >
                    {children}
                </RecoilRoot>
            ),
        });
        expect(result.current).toBeNull();
    });
});

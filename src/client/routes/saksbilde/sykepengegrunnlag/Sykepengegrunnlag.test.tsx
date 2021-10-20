import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { mappetPerson, mappetVedtaksperiode } from 'test-data';

import { persondataSkalAnonymiseres, personState } from '../../../state/person';

import { umappetArbeidsgiver } from '../../../../test/data/arbeidsgiver';
import { umappetInntektsgrunnlag } from '../../../../test/data/inntektsgrunnlag';
import {
    testEnkelPeriodeFom,
    testEnkelPeriodeTom,
    testSkjæringstidspunkt,
    testVilkårsgrunnlagHistorikkId,
    umappetPerson,
} from '../../../../test/data/person';
import { umappetUtbetalingshistorikk } from '../../../../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';
import { etInfotrygdgrunnlag } from '../../../../test/data/vilkårsgrunnlaghistorikk';
import '../../../tekster';
import { Sykepengegrunnlag } from './Sykepengegrunnlag';

const personUmappet = umappetPerson();
const enPerson = mappetPerson();
const enVedtaksperiodeIM = mappetVedtaksperiode(dayjs(testEnkelPeriodeFom), dayjs(testEnkelPeriodeTom));
const enVedtaksperiodeIT = mappetVedtaksperiode(undefined, undefined, undefined, [
    umappetInntektsgrunnlag('Infotrygd'),
]);

type WrapperOptions = {
    person?: Partial<Person>;
    vilkårsgrunnlagHistorikk?: ExternalPerson['vilkårsgrunnlagHistorikk'];
};

const wrapper =
    (options?: WrapperOptions): React.FC =>
    ({ children }) =>
        (
            <RecoilRoot
                initializeState={({ set }) => {
                    set(persondataSkalAnonymiseres, false);
                    set(personState, {
                        problems: [],
                        person: {
                            ...enPerson,
                            ...options?.person,
                            vilkårsgrunnlagHistorikk:
                                options?.vilkårsgrunnlagHistorikk ?? personUmappet.vilkårsgrunnlagHistorikk,
                            arbeidsgivereV2: personUmappet.arbeidsgivere,
                            arbeidsforhold: personUmappet.arbeidsforhold,
                        },
                    });
                }}
            >
                {children}
            </RecoilRoot>
        );

describe('Sykepengegrunnlag', () => {
    test('rendrer ubehandlet periode', () => {
        render(
            <Sykepengegrunnlag
                vilkårsgrunnlaghistorikkId={testVilkårsgrunnlagHistorikkId}
                skjæringstidspunkt={testSkjæringstidspunkt}
            />,
            {
                wrapper: wrapper({
                    person: mappetPerson([
                        umappetArbeidsgiver(
                            [umappetVedtaksperiode()],
                            [],
                            [
                                {
                                    ...umappetUtbetalingshistorikk(),
                                    utbetaling: { ...umappetUtbetalingshistorikk().utbetaling, vurdering: undefined },
                                },
                            ]
                        ),
                    ]),
                }),
            }
        );
        expect(screen.getByTestId('ubehandlet-sykepengegrunnlag')).toBeVisible();
        expect(screen.queryByText('Beregnet månedsinntekt')).toBeVisible();
    });
    test('rendrer behandlet periode', () => {
        render(
            <Sykepengegrunnlag
                vilkårsgrunnlaghistorikkId={testVilkårsgrunnlagHistorikkId}
                skjæringstidspunkt={testSkjæringstidspunkt}
            />,
            { wrapper: wrapper() }
        );
        expect(screen.getByTestId('behandlet-sykepengegrunnlag')).toBeVisible();
        expect(screen.queryByText('Beregnet månedsinntekt')).toBeVisible();
    });
    test('rendrer infotrygdforlengelse', () => {
        render(
            <Sykepengegrunnlag
                vilkårsgrunnlaghistorikkId={testVilkårsgrunnlagHistorikkId}
                skjæringstidspunkt={testSkjæringstidspunkt}
            />,
            {
                wrapper: wrapper({
                    vilkårsgrunnlagHistorikk: {
                        [testVilkårsgrunnlagHistorikkId]: {
                            [testSkjæringstidspunkt]: etInfotrygdgrunnlag(),
                        },
                    },
                }),
            }
        );
        expect(screen.getByText('Sykepengegrunnlag satt i Infotrygd')).toBeVisible();
        expect(screen.queryByText('Beregnet månedsinntekt')).toBeVisible();
        expect(screen.queryByText('Inntektsgrunnlag')).toBeVisible();
        expect(screen.queryByText('Sammenligningsgrunnlag')).toBeNull();
    });
});

import '@testing-library/jest-dom/extend-expect';
import { render, screen, within } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';
import { MutableSnapshot, RecoilRoot } from 'recoil';

import { personState } from '@state/utbetaling';

import { umappetArbeidsgiver } from '../../../test/data/arbeidsgiver';
import { mappetPerson, testSkjæringstidspunkt, testVilkårsgrunnlagHistorikkId } from '../../../test/data/person';
import { umappetUtbetalingshistorikk } from '../../../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../../../test/data/vedtaksperiode';
import { etInfotrygdgrunnlag, etSpleisgrunnlag } from '../../../test/data/vilkårsgrunnlaghistorikk';
import { Inngangsvilkår } from './Inngangsvilkår';

const utbetalingshistorikk = umappetUtbetalingshistorikk();
const enArbeidsgiver = umappetArbeidsgiver(
    [umappetVedtaksperiode()],
    [],
    [
        {
            ...utbetalingshistorikk,
            utbetaling: { ...utbetalingshistorikk.utbetaling, vurdering: undefined },
        },
    ],
);
const enPerson = mappetPerson([enArbeidsgiver]);

const arbeidsgiverMedVurdering = (
    vurdering?: ExternalHistorikkElementUtbetaling['vurdering'],
): ExternalArbeidsgiver => ({
    ...enArbeidsgiver,
    utbetalingshistorikk: [
        {
            ...enArbeidsgiver.utbetalingshistorikk[0],
            utbetaling: {
                ...enArbeidsgiver.utbetalingshistorikk[0].utbetaling,
                vurdering,
            },
        },
    ],
});

const personMedVurdering = (vurdering?: Vurdering): Person => ({
    ...enPerson,
    arbeidsgivere: [
        {
            ...enPerson.arbeidsgivere[0],
            utbetalingshistorikk: [
                {
                    ...enPerson.arbeidsgivere[0].utbetalingshistorikk[0],
                    utbetaling: {
                        ...enPerson.arbeidsgivere[0].utbetalingshistorikk[0].utbetaling,
                        vurdering,
                    },
                },
            ],
        },
    ],
});

const personMedVilkårsgrunnlag = (
    vilkårsgrunnlag: ExternalSpleisVilkårsgrunnlag | ExternalInfotrygdVilkårsgrunnlag,
    vurdering?: ExternalHistorikkElementUtbetaling['vurdering'],
) => ({
    person: {
        ...personMedVurdering(
            vurdering && {
                ...vurdering,
                tidsstempel: dayjs(vurdering.tidsstempel),
            },
        ),
        arbeidsgivereV2: [arbeidsgiverMedVurdering(vurdering)],
        arbeidsforhold: [],
        vilkårsgrunnlagHistorikk: {
            [testVilkårsgrunnlagHistorikkId]: {
                [testSkjæringstidspunkt]: vilkårsgrunnlag,
            },
        },
    },
});

const wrapper =
    (initializer?: (mutableSnapshot: MutableSnapshot) => void): React.FC =>
    ({ children }) => {
        return <RecoilRoot initializeState={initializer}>{children}</RecoilRoot>;
    };

describe('Inngangsvilkår', () => {
    it('rendrer oppfylte vilkår', () => {
        render(
            <Inngangsvilkår
                skjæringstidspunkt={testSkjæringstidspunkt}
                vilkårsgrunnlagHistorikkId={testVilkårsgrunnlagHistorikkId}
            />,
            {
                wrapper: wrapper(({ set }) => {
                    set(
                        personState,
                        personMedVilkårsgrunnlag(
                            etSpleisgrunnlag({
                                oppfyllerKravOmMedlemskap: true,
                                oppfyllerKravOmMinstelønn: true,
                                oppfyllerKravOmOpptjening: true,
                            }),
                        ),
                    );
                }),
            },
        );

        const gruppe = screen.getByTestId('oppfylte-vilkår');
        expect(gruppe).toBeVisible();
        expect(within(gruppe).getByText('Opptjeningstid')).toBeVisible();
        expect(within(gruppe).getByText('Lovvalg og medlemskap')).toBeVisible();
        expect(within(gruppe).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
    });

    it('rendrer ikke oppfylte vilkår', () => {
        render(
            <Inngangsvilkår
                skjæringstidspunkt={testSkjæringstidspunkt}
                vilkårsgrunnlagHistorikkId={testVilkårsgrunnlagHistorikkId}
            />,
            {
                wrapper: wrapper(({ set }) => {
                    set(
                        personState,
                        personMedVilkårsgrunnlag(
                            etSpleisgrunnlag({
                                oppfyllerKravOmMedlemskap: true,
                                oppfyllerKravOmMinstelønn: true,
                                oppfyllerKravOmOpptjening: false,
                            }),
                        ),
                    );
                }),
            },
        );

        const oppfylteVilkår = screen.getByTestId('oppfylte-vilkår');
        expect(oppfylteVilkår).toBeVisible();

        expect(within(oppfylteVilkår).queryByText('Opptjeningstid')).toBeNull();
        expect(within(oppfylteVilkår).getByText('Lovvalg og medlemskap')).toBeVisible();
        expect(within(oppfylteVilkår).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();

        const ikkeOppfylteVilkår = screen.getByTestId('ikke-oppfylte-vilkår');
        expect(ikkeOppfylteVilkår).toBeVisible();
        expect(within(ikkeOppfylteVilkår).getByText('Opptjeningstid')).toBeVisible();
    });

    it('rendrer vilkår vurdert av saksbehandler', async () => {
        render(
            <Inngangsvilkår
                skjæringstidspunkt={testSkjæringstidspunkt}
                vilkårsgrunnlagHistorikkId={testVilkårsgrunnlagHistorikkId}
            />,
            {
                wrapper: wrapper(({ set }) => {
                    set(
                        personState,
                        personMedVilkårsgrunnlag(
                            etSpleisgrunnlag({
                                oppfyllerKravOmMedlemskap: true,
                                oppfyllerKravOmMinstelønn: true,
                                oppfyllerKravOmOpptjening: true,
                            }),
                            {
                                godkjent: true,
                                ident: 'en-saksbehandler',
                                automatisk: false,
                                tidsstempel: '2020-01-01',
                            },
                        ),
                    );
                }),
            },
        );

        const gruppe = screen.getByTestId('vurdert-av-saksbehandler');
        expect(gruppe).toBeVisible();
        expect(within(gruppe).getByText('Opptjeningstid')).toBeVisible();
        expect(within(gruppe).getByText('Lovvalg og medlemskap')).toBeVisible();
        expect(within(gruppe).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
    });

    it('rendrer automatisk vurderte vilkår', async () => {
        render(
            <Inngangsvilkår
                skjæringstidspunkt={testSkjæringstidspunkt}
                vilkårsgrunnlagHistorikkId={testVilkårsgrunnlagHistorikkId}
            />,
            {
                wrapper: wrapper(({ set }) => {
                    set(
                        personState,
                        personMedVilkårsgrunnlag(
                            etSpleisgrunnlag({
                                oppfyllerKravOmMedlemskap: true,
                                oppfyllerKravOmMinstelønn: true,
                                oppfyllerKravOmOpptjening: true,
                            }),
                            {
                                godkjent: true,
                                automatisk: true,
                                ident: 'spleis',
                                tidsstempel: '2020-01-01',
                            },
                        ),
                    );
                }),
            },
        );

        const gruppe = screen.getByTestId('vurdert-automatisk');
        expect(gruppe).toBeVisible();
        expect(within(gruppe).getByText('Opptjeningstid')).toBeVisible();
        expect(within(gruppe).getByText('Lovvalg og medlemskap')).toBeVisible();
        expect(within(gruppe).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
    });

    it('rendrer vilkår vurdert i Infotrygd', async () => {
        render(
            <Inngangsvilkår
                skjæringstidspunkt={testSkjæringstidspunkt}
                vilkårsgrunnlagHistorikkId={testVilkårsgrunnlagHistorikkId}
            />,
            {
                wrapper: wrapper(({ set }) => {
                    set(personState, personMedVilkårsgrunnlag(etInfotrygdgrunnlag()));
                }),
            },
        );

        const gruppe = screen.getByTestId('vurdert-i-infotrygd');
        expect(gruppe).toBeVisible();
        expect(within(gruppe).getByText('Opptjeningstid')).toBeVisible();
        expect(within(gruppe).getByText('Lovvalg og medlemskap')).toBeVisible();
        expect(within(gruppe).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
    });
});

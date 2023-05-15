import { Inngangsvilkår, InngangsvilkårWithContent } from './Inngangsvilkår';
import React from 'react';

import { VilkarsgrunnlagSpleis, Vilkarsgrunnlagtype, Vurdering } from '@io/graphql';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, within } from '@testing-library/react';

const getVilkårsgrunnlagSpleis = (overrides?: Partial<VilkarsgrunnlagSpleis>): VilkarsgrunnlagSpleis => ({
    id: 'en-id',
    antallOpptjeningsdagerErMinst: 100,
    arbeidsgiverrefusjoner: [],
    grunnbelop: 100000,
    inntekter: [],
    omregnetArsinntekt: 1234567,
    oppfyllerKravOmMedlemskap: true,
    oppfyllerKravOmMinstelonn: true,
    oppfyllerKravOmOpptjening: true,
    opptjeningFra: '2000-01-01',
    sammenligningsgrunnlag: 1234567,
    skjaeringstidspunkt: '2022-01-01',
    sykepengegrunnlag: 1234567,
    sykepengegrunnlagsgrense: { grunnbelop: 106399, grense: 6 * 106399, virkningstidspunkt: '2021-05-01' },
    vilkarsgrunnlagtype: Vilkarsgrunnlagtype.Spleis,
    ...overrides,
});

const getVurdering = (overrides?: Partial<Vurdering>): Vurdering => ({
    godkjent: true,
    ident: 'en-saksbehandler',
    automatisk: false,
    tidsstempel: '2020-01-01',
    ...overrides,
});

describe('Inngangsvilkår', () => {
    it('rendrer oppfylte vilkår', () => {
        render(
            <InngangsvilkårWithContent
                periodeFom="2022-01-01"
                vilkårsgrunnlag={getVilkårsgrunnlagSpleis()}
                fødselsdato="1900-01-01"
            />,
        );

        const gruppe = screen.getByTestId('oppfylte-vilkår');
        expect(gruppe).toBeVisible();
        expect(within(gruppe).getByText('Opptjeningstid')).toBeVisible();
        expect(within(gruppe).getByText('Lovvalg og medlemskap')).toBeVisible();
        expect(within(gruppe).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
    });

    it('rendrer ikke oppfylte vilkår', () => {
        render(
            <InngangsvilkårWithContent
                periodeFom="2022-01-01"
                vilkårsgrunnlag={getVilkårsgrunnlagSpleis({ oppfyllerKravOmOpptjening: false })}
                fødselsdato="1900-01-01"
            />,
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
            <InngangsvilkårWithContent
                periodeFom="2022-01-01"
                vilkårsgrunnlag={getVilkårsgrunnlagSpleis()}
                fødselsdato="1900-01-01"
                vurdering={getVurdering()}
            />,
        );

        const gruppe = screen.getByTestId('vurdert-av-saksbehandler');
        expect(gruppe).toBeVisible();
        expect(within(gruppe).getByText('Opptjeningstid')).toBeVisible();
        expect(within(gruppe).getByText('Lovvalg og medlemskap')).toBeVisible();
        expect(within(gruppe).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
    });

    it('rendrer automatisk vurderte vilkår', async () => {
        render(
            <InngangsvilkårWithContent
                periodeFom="2022-01-01"
                vilkårsgrunnlag={getVilkårsgrunnlagSpleis()}
                fødselsdato="1900-01-01"
                vurdering={getVurdering({ automatisk: true })}
            />,
        );

        const gruppe = screen.getByTestId('vurdert-automatisk');
        expect(gruppe).toBeVisible();
        expect(within(gruppe).getByText('Opptjeningstid')).toBeVisible();
        expect(within(gruppe).getByText('Lovvalg og medlemskap')).toBeVisible();
        expect(within(gruppe).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
    });

    it('rendrer vilkår vurdert i Infotrygd', async () => {
        render(
            <InngangsvilkårWithContent
                periodeFom="2022-01-01"
                vilkårsgrunnlag={getVilkårsgrunnlagSpleis({ vilkarsgrunnlagtype: Vilkarsgrunnlagtype.Infotrygd })}
                fødselsdato="1900-01-01"
            />,
        );

        const gruppe = screen.getByTestId('vurdert-i-infotrygd');
        expect(gruppe).toBeVisible();
        expect(within(gruppe).getByText('Opptjeningstid')).toBeVisible();
        expect(within(gruppe).getByText('Lovvalg og medlemskap')).toBeVisible();
        expect(within(gruppe).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
    });
});

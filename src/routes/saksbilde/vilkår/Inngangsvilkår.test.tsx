import React from 'react';

import { VilkarsgrunnlagInfotrygdV2, VilkarsgrunnlagSpleisV2, VilkarsgrunnlagVurdering, Vurdering } from '@io/graphql';
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';

import { InngangsvilkårWithContent } from './Inngangsvilkår';

const getVilkårsgrunnlagSpleis = (
    // TODO: Erstatte global type med query type
    overrides?: Partial<VilkarsgrunnlagSpleisV2>,
): VilkarsgrunnlagSpleisV2 => ({
    __typename: 'VilkarsgrunnlagSpleisV2',
    id: 'en-id',
    antallOpptjeningsdagerErMinst: 100,
    arbeidsgiverrefusjoner: [],
    grunnbelop: 100000,
    inntekter: [],
    vurderingAvKravOmMedlemskap: VilkarsgrunnlagVurdering.Oppfylt,
    oppfyllerKravOmMinstelonn: true,
    oppfyllerKravOmOpptjening: true,
    opptjeningFra: '2000-01-01',
    skjaeringstidspunkt: '2022-01-01',
    sykepengegrunnlag: 1234567,
    beregningsgrunnlag: '1234567',
    avviksvurdering: {
        __typename: 'VilkarsgrunnlagAvviksvurdering',
        avviksprosent: '0',
        beregningsgrunnlag: '1234567',
        sammenligningsgrunnlag: '1234567',
    },
    skjonnsmessigFastsattAarlig: null,
    sykepengegrunnlagsgrense: {
        __typename: 'Sykepengegrunnlagsgrense',
        grunnbelop: 106399,
        grense: 6 * 106399,
        virkningstidspunkt: '2021-05-01',
    },
    ...overrides,
});

const getVilkårsgrunnlagInfotrygd = (): VilkarsgrunnlagInfotrygdV2 => ({
    __typename: 'VilkarsgrunnlagInfotrygdV2',
    id: 'en-id',
    arbeidsgiverrefusjoner: [],
    inntekter: [],
    skjaeringstidspunkt: '2022-01-01',
    sykepengegrunnlag: 1234567,
    omregnetArsinntekt: 1234567,
});

const getVurdering = (overrides?: Partial<Vurdering>): Vurdering => ({
    __typename: 'Vurdering',
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

        expect(within(oppfylteVilkår).queryByText('Opptjeningstid')).not.toBeInTheDocument();
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
                vilkårsgrunnlag={getVilkårsgrunnlagInfotrygd()}
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

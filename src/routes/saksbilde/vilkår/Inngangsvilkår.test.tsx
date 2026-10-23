import React from 'react';

import {
    ApiVilkårsgrunnlagInfotrygdV2,
    ApiVilkårsgrunnlagSpleisV2,
    ApiVilkårsgrunnlagVurdering,
} from '@io/rest/generated/spesialist.schemas';
import { render, screen, within } from '@test-utils';

import { InngangsvilkårWithContent } from './Inngangsvilkår';

vi.mock('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger')>()),
    useGetVilkårsvurderingerForPersonBehandler: () => ({ data: undefined, isLoading: true, isError: false }),
    useGetOpptjeningshistorikkBehandler: () => ({ data: undefined, isLoading: true, isError: false }),
}));

const opptjeningProps = {
    personPseudoId: 'en-person',
    opptjeningsvurderingId: 'en-id',
    readOnly: false,
    serPåTidligereBehandling: false,
};

const getVilkårsgrunnlagSpleis = (
    // TODO: Erstatte global type med query type
    overrides?: Partial<ApiVilkårsgrunnlagSpleisV2>,
): ApiVilkårsgrunnlagSpleisV2 => ({
    type: 'ApiVilkårsgrunnlagSpleisV2',
    id: 'en-id',
    antallOpptjeningsdagerErMinst: 100,
    arbeidsgiverrefusjoner: [],
    grunnbelop: 100000,
    inntekter: [],
    vurderingAvKravOmMedlemskap: ApiVilkårsgrunnlagVurdering.OPPFYLT,
    oppfyllerKravOmMinstelonn: true,
    oppfyllerKravOmOpptjening: true,
    opptjeningFra: '2000-01-01',
    opptjeningsvurderingId: 'en-opptjeningsvurdering-id',
    skjaeringstidspunkt: '2022-01-01',
    sykepengegrunnlag: 1234567,
    beregningsgrunnlag: '1234567',
    forsikringsvurderingId: null,
    avviksvurdering: {
        avviksprosent: '0',
        beregningsgrunnlag: '1234567',
        sammenligningsgrunnlag: '1234567',
    },
    skjonnsmessigFastsattAarlig: null,
    sykepengegrunnlagsgrense: {
        grunnbelop: 106399,
        grense: 6 * 106399,
        virkningstidspunkt: '2021-05-01',
    },
    ...overrides,
});

const getVilkårsgrunnlagInfotrygd = (): ApiVilkårsgrunnlagInfotrygdV2 => ({
    type: 'ApiVilkårsgrunnlagInfotrygdV2',
    id: 'en-id',
    arbeidsgiverrefusjoner: [],
    inntekter: [],
    skjaeringstidspunkt: '2022-01-01',
    sykepengegrunnlag: 1234567,
    omregnetArsinntekt: 1234567,
    opptjeningsvurderingId: 'en-opptjeningsvurdering-id',
});
describe('Inngangsvilkår', () => {
    it('rendrer opptjening, sykepengegrunnlag og medlemskap', () => {
        render(
            <InngangsvilkårWithContent
                vilkårsgrunnlag={getVilkårsgrunnlagSpleis()}
                fødselsdato="1900-01-01"
                {...opptjeningProps}
            />,
        );

        expect(screen.getByRole('region', { name: 'Opptjeningstid' })).toBeVisible();

        const sykepengegrunnlag = screen.getByRole('region', { name: 'Krav til minste sykepengegrunnlag' });
        expect(within(sykepengegrunnlag).getByText('Krav til minste sykepengegrunnlag')).toBeVisible();
        expect(within(sykepengegrunnlag).getByText('Oppfylt', { selector: '.aksel-tag' })).toBeVisible();

        const medlemskap = screen.getByRole('region', { name: 'Lovvalg og medlemskap' });
        expect(within(medlemskap).getByText('Lovvalg og medlemskap')).toBeVisible();
        expect(within(medlemskap).getByText('Oppfylt', { selector: '.aksel-tag' })).toBeVisible();
    });

    it('viser ikke oppfylt/ikke vurdert-utfall for sykepengegrunnlag og medlemskap', () => {
        render(
            <InngangsvilkårWithContent
                vilkårsgrunnlag={getVilkårsgrunnlagSpleis({
                    oppfyllerKravOmMinstelonn: false,
                    vurderingAvKravOmMedlemskap: ApiVilkårsgrunnlagVurdering.IKKE_VURDERT,
                })}
                fødselsdato="1900-01-01"
                {...opptjeningProps}
            />,
        );

        const sykepengegrunnlag = screen.getByRole('region', { name: 'Krav til minste sykepengegrunnlag' });
        expect(within(sykepengegrunnlag).getByText('Ikke oppfylt', { selector: '.aksel-tag' })).toBeVisible();

        const medlemskap = screen.getByRole('region', { name: 'Lovvalg og medlemskap' });
        expect(within(medlemskap).getByText('Ikke vurdert', { selector: '.aksel-tag' })).toBeVisible();
    });

    it('viser "Vurdert i Infotrygd" som utfall-tag når vilkårsgrunnlaget er fra Infotrygd', () => {
        render(
            <InngangsvilkårWithContent
                vilkårsgrunnlag={getVilkårsgrunnlagInfotrygd()}
                fødselsdato="1900-01-01"
                {...opptjeningProps}
            />,
        );

        const sykepengegrunnlag = screen.getByRole('region', { name: 'Krav til minste sykepengegrunnlag' });
        expect(within(sykepengegrunnlag).getByText('Vurdert i Infotrygd')).toBeVisible();

        const medlemskap = screen.getByRole('region', { name: 'Lovvalg og medlemskap' });
        expect(within(medlemskap).getByText('Vurdert i Infotrygd')).toBeVisible();
    });
});

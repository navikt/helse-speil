import { nanoid } from 'nanoid';

import {
    Arbeidsgiverinntekt,
    VilkarsgrunnlagV2_VilkarsgrunnlagInfotrygdV2_Fragment,
    VilkarsgrunnlagV2_VilkarsgrunnlagSpleisV2_Fragment,
    VilkarsgrunnlagVurdering,
} from '@io/graphql';
import { enArbeidsgiverinntekt } from '@test-data/arbeidsgiverinntekt';
import { OverridableConstructor } from '@typer/shared';

type VilkarsgrunnlagSpleisExtensions = {
    medInntekter: (
        inntekter: Array<Arbeidsgiverinntekt>,
    ) => VilkarsgrunnlagV2_VilkarsgrunnlagSpleisV2_Fragment & VilkarsgrunnlagSpleisExtensions;
};

export const etVilkårsgrunnlagFraSpleis: OverridableConstructor<
    VilkarsgrunnlagV2_VilkarsgrunnlagSpleisV2_Fragment,
    VilkarsgrunnlagSpleisExtensions
> = (overrides) => ({
    __typename: 'VilkarsgrunnlagSpleisV2',
    id: nanoid(),
    antallOpptjeningsdagerErMinst: 1234,
    arbeidsgiverrefusjoner: [],
    avviksvurdering: {
        __typename: 'VilkarsgrunnlagAvviksvurdering',
        avviksprosent: '0',
        beregningsgrunnlag: '600000',
        sammenligningsgrunnlag: '600000',
    },
    beregningsgrunnlag: '600000',
    grunnbelop: 100000,
    inntekter: [enArbeidsgiverinntekt()],
    vurderingAvKravOmMedlemskap: VilkarsgrunnlagVurdering.Oppfylt,
    oppfyllerKravOmMinstelonn: true,
    oppfyllerKravOmOpptjening: true,
    opptjeningFra: '2000-01-01',
    skjaeringstidspunkt: '2020-01-01',
    sykepengegrunnlag: 600000,
    skjonnsmessigFastsattAarlig: null,
    sykepengegrunnlagsgrense: {
        __typename: 'Sykepengegrunnlagsgrense',
        grense: 600000,
        grunnbelop: 100000,
        virkningstidspunkt: '2020-01-01',
    },
    ...overrides,
    medInntekter(inntekter) {
        this.inntekter = inntekter;
        return this;
    },
});

export const etVilkårsgrunnlagFraInfotrygd: OverridableConstructor<
    VilkarsgrunnlagV2_VilkarsgrunnlagInfotrygdV2_Fragment
> = (overrides) => ({
    __typename: 'VilkarsgrunnlagInfotrygdV2',
    id: nanoid(),
    inntekter: [enArbeidsgiverinntekt()],
    omregnetArsinntekt: 600000,
    sammenligningsgrunnlag: 600000,
    skjaeringstidspunkt: '2020-01-01',
    sykepengegrunnlag: 600000,
    arbeidsgiverrefusjoner: [],
    ...overrides,
});

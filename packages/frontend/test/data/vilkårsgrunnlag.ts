import { nanoid } from 'nanoid';

import { Arbeidsgiverinntekt, VilkarsgrunnlagSpleis, Vilkarsgrunnlagtype } from '@io/graphql';
import { enArbeidsgiverinntekt } from '@test-data/arbeidsgiverinntekt';

type VilkarsgrunnlagSpleisExtensions = {
    medInntekter: (inntekter: Array<Arbeidsgiverinntekt>) => VilkarsgrunnlagSpleis & VilkarsgrunnlagSpleisExtensions;
};
export const etVilkårsgrunnlagFraSpleis: OverridableConstructor<
    VilkarsgrunnlagSpleis,
    VilkarsgrunnlagSpleisExtensions
> = (overrides) => ({
    id: nanoid(),
    antallOpptjeningsdagerErMinst: 1234,
    avviksprosent: 0,
    grunnbelop: 100000,
    inntekter: [enArbeidsgiverinntekt()],
    omregnetArsinntekt: 600000,
    oppfyllerKravOmMedlemskap: true,
    oppfyllerKravOmMinstelonn: true,
    oppfyllerKravOmOpptjening: true,
    opptjeningFra: '2000-01-01',
    sammenligningsgrunnlag: 600000,
    skjaeringstidspunkt: '2020-01-01',
    sykepengegrunnlag: 600000,
    sykepengegrunnlagsgrense: {
        grense: 600000,
        grunnbelop: 100000,
        virkningstidspunkt: '2020-01-01',
    },
    vilkarsgrunnlagtype: Vilkarsgrunnlagtype.Spleis,
    ...overrides,
    medInntekter(inntekter) {
        this.inntekter = inntekter;
        return this;
    },
});

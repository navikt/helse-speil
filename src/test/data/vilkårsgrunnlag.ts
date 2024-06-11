import { nanoid } from 'nanoid';

import { OverridableConstructor } from '@/types/shared';
import {
    Arbeidsgiverinntekt,
    VilkarsgrunnlagFragment,
    VilkarsgrunnlagInfotrygd,
    VilkarsgrunnlagSpleis,
    Vilkarsgrunnlag_VilkarsgrunnlagInfotrygd_Fragment,
    Vilkarsgrunnlag_VilkarsgrunnlagSpleis_Fragment,
    Vilkarsgrunnlagtype,
} from '@io/graphql';
import { enArbeidsgiverinntekt } from '@test-data/arbeidsgiverinntekt';

type VilkarsgrunnlagSpleisExtensions = {
    medInntekter: (
        inntekter: Array<Arbeidsgiverinntekt>,
    ) => Vilkarsgrunnlag_VilkarsgrunnlagSpleis_Fragment & VilkarsgrunnlagSpleisExtensions;
};

export const etVilkårsgrunnlagFraSpleis: OverridableConstructor<
    Vilkarsgrunnlag_VilkarsgrunnlagSpleis_Fragment,
    VilkarsgrunnlagSpleisExtensions
> = (overrides) => ({
    __typename: 'VilkarsgrunnlagSpleis',
    id: nanoid(),
    antallOpptjeningsdagerErMinst: 1234,
    arbeidsgiverrefusjoner: [],
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
    skjonnsmessigFastsattAarlig: null,
    sykepengegrunnlagsgrense: {
        __typename: 'Sykepengegrunnlagsgrense',
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

export const etVilkårsgrunnlagFraInfotrygd: OverridableConstructor<
    Vilkarsgrunnlag_VilkarsgrunnlagInfotrygd_Fragment
> = (overrides) => ({
    __typename: 'VilkarsgrunnlagInfotrygd',
    id: nanoid(),
    inntekter: [enArbeidsgiverinntekt()],
    omregnetArsinntekt: 600000,
    sammenligningsgrunnlag: 600000,
    skjaeringstidspunkt: '2020-01-01',
    sykepengegrunnlag: 600000,
    vilkarsgrunnlagtype: Vilkarsgrunnlagtype.Infotrygd,
    arbeidsgiverrefusjoner: [],
    ...overrides,
});

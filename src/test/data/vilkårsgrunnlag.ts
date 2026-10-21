import {
    ApiArbeidsgiverinntekt,
    ApiVilkårsgrunnlagInfotrygdV2,
    ApiVilkårsgrunnlagSpleisV2,
    ApiVilkårsgrunnlagVurdering,
} from '@io/rest/generated/spesialist.schemas';
import { enArbeidsgiverinntekt } from '@test-data/arbeidsgiverinntekt';
import { OverridableConstructor } from '@typer/shared';
import { generateId } from '@utils/generateId';

type VilkarsgrunnlagSpleisExtensions = {
    medInntekter: (inntekter: ApiArbeidsgiverinntekt[]) => ApiVilkårsgrunnlagSpleisV2 & VilkarsgrunnlagSpleisExtensions;
};

export const etVilkårsgrunnlagFraSpleis: OverridableConstructor<
    ApiVilkårsgrunnlagSpleisV2,
    VilkarsgrunnlagSpleisExtensions
> = (overrides) => ({
    type: 'ApiVilkårsgrunnlagSpleisV2',
    id: generateId(),
    antallOpptjeningsdagerErMinst: 1234,
    arbeidsgiverrefusjoner: [],
    avviksvurdering: {
        avviksprosent: '0',
        beregningsgrunnlag: '600000',
        sammenligningsgrunnlag: '600000',
    },
    beregningsgrunnlag: '600000',
    forsikringsvurderingId: null,
    grunnbelop: 100000,
    inntekter: [enArbeidsgiverinntekt()],
    vurderingAvKravOmMedlemskap: ApiVilkårsgrunnlagVurdering.OPPFYLT,
    oppfyllerKravOmMinstelonn: true,
    oppfyllerKravOmOpptjening: true,
    opptjeningFra: '2000-01-01',
    opptjeningsvurderingId: 'a1b2c3d4-0000-4000-8000-000000000001',
    skjaeringstidspunkt: '2020-01-01',
    sykepengegrunnlag: 600000,
    skjonnsmessigFastsattAarlig: null,
    sykepengegrunnlagsgrense: {
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

export const etVilkårsgrunnlagFraInfotrygd: OverridableConstructor<ApiVilkårsgrunnlagInfotrygdV2> = (overrides) => ({
    type: 'ApiVilkårsgrunnlagInfotrygdV2',
    id: generateId(),
    inntekter: [enArbeidsgiverinntekt()],
    omregnetArsinntekt: 600000,
    opptjeningsvurderingId: 'a1b2c3d4-0000-4000-8000-000000000002',
    sammenligningsgrunnlag: 600000,
    skjaeringstidspunkt: '2020-01-01',
    sykepengegrunnlag: 600000,
    arbeidsgiverrefusjoner: [],
    ...overrides,
});

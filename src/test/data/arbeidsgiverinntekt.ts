import dayjs from 'dayjs';

import {
    ApiArbeidsgiverinntekt,
    ApiInntektFraAOrdningen,
    ApiInntektskilde,
    ApiOmregnetArsinntekt,
    ApiVilkårsgrunnlagV2,
} from '@io/rest/generated/spesialist.schemas';
import { DateString, OverridableConstructor } from '@typer/shared';

const enInntektFraAOrdningen: OverridableConstructor<ApiInntektFraAOrdningen> = (overrides) => ({
    maned: '2020-01',
    sum: 600000 / 12,
    ...overrides,
});

const inntekterFraAOrdningen = (start: DateString): ApiInntektFraAOrdningen[] => {
    return new Array(3).fill(0).map((_, i) => {
        return enInntektFraAOrdningen({ maned: dayjs(start).add(i, 'month').format('YYYY-MM') });
    });
};

type OmregnetArsinntektExtensions = {
    medInntektFraAordningen: (
        inntekt?: ApiInntektFraAOrdningen[],
    ) => ApiOmregnetArsinntekt & OmregnetArsinntektExtensions;
};

const enOmregnetÅrsinntekt: OverridableConstructor<ApiOmregnetArsinntekt, OmregnetArsinntektExtensions> = (
    overrides,
) => {
    const inntektFraAOrdningen = inntekterFraAOrdningen('2020-01-01');
    return {
        belop: 600000,
        inntektFraAOrdningen: inntektFraAOrdningen,
        kilde: ApiInntektskilde.INNTEKTSMELDING,
        manedsbelop: 600000 / 12,
        ...overrides,
        medInntektFraAordningen(inntekt) {
            this.kilde = ApiInntektskilde.AORDNINGEN;
            this.inntektFraAOrdningen = inntekt ?? inntektFraAOrdningen;
            return this;
        },
    };
};

type ArbeidsgiverinntektExtensions = {
    medInntektFraAOrdningen: (
        inntekt?: ApiInntektFraAOrdningen[],
    ) => ApiArbeidsgiverinntekt & ArbeidsgiverinntektExtensions;
};

export const enArbeidsgiverinntekt: OverridableConstructor<
    ApiVilkårsgrunnlagV2['inntekter'][0],
    ArbeidsgiverinntektExtensions
> = (overrides) => ({
    arbeidsgiver: '987654321',
    deaktivert: false,
    omregnetArsinntekt: enOmregnetÅrsinntekt(),
    skjonnsmessigFastsatt: null,
    sammenligningsgrunnlag: {
        belop: 600000,
        inntektFraAOrdningen: [enInntektFraAOrdningen()],
    },
    fom: null,
    tom: null,
    ...overrides,
    medInntektFraAOrdningen(inntekt) {
        this.omregnetArsinntekt = enOmregnetÅrsinntekt().medInntektFraAordningen(inntekt);
        this.sammenligningsgrunnlag = {
            belop: 60000,
            inntektFraAOrdningen: inntekt ?? [enInntektFraAOrdningen()],
        };
        return this;
    },
});

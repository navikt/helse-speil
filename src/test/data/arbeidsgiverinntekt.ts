import dayjs from 'dayjs';

import {
    Arbeidsgiverinntekt,
    InntektFraAOrdningen,
    Inntektskilde,
    OmregnetArsinntekt,
    VilkarsgrunnlagV2Fragment,
} from '@io/graphql';
import { DateString, OverridableConstructor } from '@typer/shared';

const enInntektFraAOrdningen: OverridableConstructor<InntektFraAOrdningen> = (overrides) => ({
    __typename: 'InntektFraAOrdningen',
    maned: '2020-01',
    sum: 600000 / 12,
    ...overrides,
});

const inntekterFraAOrdningen = (start: DateString): InntektFraAOrdningen[] => {
    return new Array(3).fill(0).map((_, i) => {
        return enInntektFraAOrdningen({ maned: dayjs(start).add(i, 'month').format('YYYY-MM') });
    });
};

type OmregnetArsinntektExtensions = {
    medInntektFraAordningen: (inntekt?: InntektFraAOrdningen[]) => OmregnetArsinntekt & OmregnetArsinntektExtensions;
};

const enOmregnetÅrsinntekt: OverridableConstructor<OmregnetArsinntekt, OmregnetArsinntektExtensions> = (overrides) => {
    const inntektFraAOrdningen = inntekterFraAOrdningen('2020-01-01');
    return {
        __typename: 'OmregnetArsinntekt',
        belop: 600000,
        inntektFraAOrdningen: inntektFraAOrdningen,
        kilde: Inntektskilde.Inntektsmelding,
        manedsbelop: 600000 / 12,
        ...overrides,
        medInntektFraAordningen(inntekt) {
            this.kilde = Inntektskilde.Aordningen;
            this.inntektFraAOrdningen = inntekt ?? inntektFraAOrdningen;
            return this;
        },
    };
};

type ArbeidsgiverinntektExtensions = {
    medInntektFraAOrdningen: (inntekt?: InntektFraAOrdningen[]) => Arbeidsgiverinntekt & ArbeidsgiverinntektExtensions;
};

export const enArbeidsgiverinntekt: OverridableConstructor<
    VilkarsgrunnlagV2Fragment['inntekter'][0],
    ArbeidsgiverinntektExtensions
> = (overrides) => ({
    __typename: 'Arbeidsgiverinntekt',
    arbeidsgiver: '987654321',
    deaktivert: false,
    omregnetArsinntekt: enOmregnetÅrsinntekt(),
    skjonnsmessigFastsatt: null,
    sammenligningsgrunnlag: {
        __typename: 'Sammenligningsgrunnlag',
        belop: 600000,
        inntektFraAOrdningen: [enInntektFraAOrdningen()],
    },
    fom: null,
    tom: null,
    ...overrides,
    medInntektFraAOrdningen(inntekt) {
        this.omregnetArsinntekt = enOmregnetÅrsinntekt().medInntektFraAordningen(inntekt);
        this.sammenligningsgrunnlag = {
            __typename: 'Sammenligningsgrunnlag',
            belop: 60000,
            inntektFraAOrdningen: inntekt ?? [enInntektFraAOrdningen()],
        };
        return this;
    },
});

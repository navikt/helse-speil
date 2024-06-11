import dayjs from 'dayjs';

import { Arbeidsgiverinntekt, InntektFraAOrdningen, Inntektskilde, OmregnetArsinntekt } from '@io/graphql';

const enInntektFraAOrdningen: OverridableConstructor<InntektFraAOrdningen> = (overrides) => ({
    __typename: 'InntektFraAOrdningen',
    maned: '2020-01',
    sum: 600000 / 12,
    ...overrides,
});

const inntekterFraAOrdningen = (start: DateString): Array<InntektFraAOrdningen> => {
    return new Array(3).fill(0).map((_, i) => {
        return enInntektFraAOrdningen({ maned: dayjs(start).add(i, 'month').format('YYYY-MM') });
    });
};

type OmregnetArsinntektExtensions = {
    medInntektFraAordningen: (
        inntekt?: Array<InntektFraAOrdningen>,
    ) => OmregnetArsinntekt & OmregnetArsinntektExtensions;
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
    medInntektFraAOrdningen: (
        inntekt?: Array<InntektFraAOrdningen>,
    ) => Arbeidsgiverinntekt & ArbeidsgiverinntektExtensions;
};

export const enArbeidsgiverinntekt: OverridableConstructor<Arbeidsgiverinntekt, ArbeidsgiverinntektExtensions> = (
    overrides,
) => ({
    __typename: 'Arbeidsgiverinntekt',
    arbeidsgiver: '987654321',
    deaktivert: false,
    omregnetArsinntekt: enOmregnetÅrsinntekt(),
    sammenligningsgrunnlag: {
        __typename: 'Sammenligningsgrunnlag',
        belop: 600000,
        inntektFraAOrdningen: [enInntektFraAOrdningen()],
    },
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

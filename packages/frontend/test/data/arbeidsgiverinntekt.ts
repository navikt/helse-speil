import { Arbeidsgiverinntekt, InntektFraAOrdningen, Inntektskilde, OmregnetArsinntekt } from '@io/graphql';

const enInntektFraAOrdningen: OverridableConstructor<InntektFraAOrdningen> = (overrides) => ({
    maned: '2020-01',
    sum: 600000 / 12,
    ...overrides,
});

type OmregnetArsinntektExtensions = {
    medInntektFraAordningen: (
        inntekt?: Array<InntektFraAOrdningen>
    ) => OmregnetArsinntekt & OmregnetArsinntektExtensions;
};

const enOmregnetÅrsinntekt: OverridableConstructor<OmregnetArsinntekt, OmregnetArsinntektExtensions> = (overrides) => ({
    belop: 600000,
    inntektFraAOrdningen: [enInntektFraAOrdningen()],
    kilde: Inntektskilde.Inntektsmelding,
    manedsbelop: 600000 / 12,
    ...overrides,
    medInntektFraAordningen(inntekt) {
        this.kilde = Inntektskilde.Aordningen;
        this.inntektFraAOrdningen = inntekt ?? [enInntektFraAOrdningen()];
        return this;
    },
});

type ArbeidsgiverinntektExtensions = {
    medInntektFraAOrdningen: (
        inntekt?: Array<InntektFraAOrdningen>
    ) => Arbeidsgiverinntekt & ArbeidsgiverinntektExtensions;
};

export const enArbeidsgiverinntekt: OverridableConstructor<Arbeidsgiverinntekt, ArbeidsgiverinntektExtensions> = (
    overrides
) => ({
    arbeidsgiver: '987654321',
    deaktivert: false,
    omregnetArsinntekt: enOmregnetÅrsinntekt(),
    sammenligningsgrunnlag: {
        belop: 600000,
        inntektFraAOrdningen: [enInntektFraAOrdningen()],
    },
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

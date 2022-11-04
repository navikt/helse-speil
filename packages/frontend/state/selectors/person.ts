import { Arbeidsgiverinntekt, Inntektskilde, Vilkarsgrunnlag } from '@io/graphql';

export const getInntekt = (vilkårsgrunnlag: Vilkarsgrunnlag, organisasjonsnummer: string): Arbeidsgiverinntekt =>
    vilkårsgrunnlag.inntekter.find((it) => it.arbeidsgiver === organisasjonsnummer) ??
    (() => {
        throw Error('Fant ikke inntekt');
    })();

export const getInntektFraInntektsmelding = (
    grunnlag: Vilkarsgrunnlag,
    organisasjonsnummer: string
): Arbeidsgiverinntekt | null => {
    return (
        grunnlag.inntekter.find(
            (it) =>
                it.arbeidsgiver === organisasjonsnummer &&
                it.omregnetArsinntekt?.kilde === Inntektskilde.Inntektsmelding
        ) ?? null
    );
};

export const getInntektFraAOrdningen = (
    grunnlag: Vilkarsgrunnlag,
    organisasjonsnummer: string
): Arbeidsgiverinntekt | null => {
    return (
        grunnlag.inntekter.find(
            (it) => it.arbeidsgiver === organisasjonsnummer && it.omregnetArsinntekt?.kilde === Inntektskilde.Aordningen
        ) ?? null
    );
};

export type Inntekter = {
    organisasjonsnummer: string;
    fraInntektsmelding?: Maybe<Arbeidsgiverinntekt>;
    fraAOrdningen?: Maybe<Arbeidsgiverinntekt>;
};

export const getInntekter = (grunnlag: Vilkarsgrunnlag, organisasjonsnummer: string): Inntekter => {
    const inntekter: Inntekter = {
        organisasjonsnummer,
        fraInntektsmelding: getInntektFraInntektsmelding(grunnlag, organisasjonsnummer),
        fraAOrdningen: getInntektFraAOrdningen(grunnlag, organisasjonsnummer),
    };

    if (inntekter.fraAOrdningen === null && inntekter.fraInntektsmelding === null) {
        throw Error('Fant ikke inntekt');
    }

    return inntekter;
};

export const getVilkårsgrunnlag = (person: FetchedPerson, vilkårsgrunnlagId?: Maybe<string>): Vilkarsgrunnlag =>
    person.vilkarsgrunnlag.find(({ id }) => id === vilkårsgrunnlagId) ??
    (() => {
        throw Error('Fant ikke vilkårsgrunnlag');
    })();

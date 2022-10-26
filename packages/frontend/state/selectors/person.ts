import { Arbeidsgiverinntekt, Vilkarsgrunnlag } from '@io/graphql';

export const getInntekt = (vilkårsgrunnlag: Vilkarsgrunnlag, organisasjonsnummer: string): Arbeidsgiverinntekt =>
    vilkårsgrunnlag.inntekter.find((it) => it.arbeidsgiver === organisasjonsnummer) ??
    (() => {
        throw Error('Fant ikke inntekt');
    })();

export const getVilkårsgrunnlag = (person: FetchedPerson, vilkårsgrunnlagId?: Maybe<string>): Vilkarsgrunnlag =>
    person.vilkarsgrunnlag.find(({ id }) => id === vilkårsgrunnlagId) ??
    (() => {
        throw Error('Fant ikke vilkårsgrunnlag');
    })();

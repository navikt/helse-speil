import dayjs from 'dayjs';

import { Arbeidsgiverinntekt, Person, Vilkarsgrunnlag } from '@io/graphql';

export const getInntekt = (vilkårsgrunnlag: Vilkarsgrunnlag, organisasjonsnummer: string): Arbeidsgiverinntekt =>
    vilkårsgrunnlag.inntekter.find((it) => it.arbeidsgiver === organisasjonsnummer) ??
    (() => {
        throw Error('Fant ikke inntekt');
    })();

const bySkjæringstidspunktDescending = (a: Vilkarsgrunnlag, b: Vilkarsgrunnlag): number => {
    return new Date(b.skjaeringstidspunkt).getTime() - new Date(a.skjaeringstidspunkt).getTime();
};

export const getVilkårsgrunnlag = (
    person: Person,
    vilkårsgrunnlagId: string,
    skjæringstidspunkt: DateString,
    periodeTom: DateString
): Vilkarsgrunnlag =>
    person.vilkarsgrunnlaghistorikk
        .find(({ id }) => id === vilkårsgrunnlagId)
        ?.grunnlag.filter(
            (grunnlag) =>
                dayjs(grunnlag.skjaeringstidspunkt).isSameOrAfter(skjæringstidspunkt) &&
                dayjs(grunnlag.skjaeringstidspunkt).isSameOrBefore(periodeTom)
        )
        .sort(bySkjæringstidspunktDescending)
        .pop() ??
    (() => {
        throw Error('Fant ikke vilkårsgrunnlag');
    })();

import dayjs from 'dayjs';

import {
    Arbeidsgiverinntekt,
    BeregnetPeriode,
    Inntektsgrunnlag,
    Periode,
    Person,
    Refusjon,
    Vilkarsgrunnlag,
} from '@io/graphql';

const onlyBeregnedePerioder = (periode: Periode): periode is BeregnetPeriode =>
    (periode as BeregnetPeriode).beregningId !== null;

export const selectRefusjon = (person: Person, beregningId: string): Refusjon | null =>
    person.arbeidsgivere
        .flatMap((it) => it.generasjoner)
        .flatMap((it) => it.perioder)
        .filter(onlyBeregnedePerioder)
        .find((it) => it.beregningId === beregningId)?.refusjon ?? null;

export const getInntekt = (vilkårsgrunnlag: Vilkarsgrunnlag, organisasjonsnummer: string): Arbeidsgiverinntekt =>
    vilkårsgrunnlag.inntekter.find((it) => it.arbeidsgiver === organisasjonsnummer) ??
    (() => {
        throw Error('Fant ikke inntekt');
    })();

export const getInntektsgrunnlag = (
    person: Person,
    skjæringstidspunkt: DateString,
    periodeTom: DateString,
): Inntektsgrunnlag =>
    person.inntektsgrunnlag.find(
        (inntektsgrunnlag) =>
            dayjs(inntektsgrunnlag.skjaeringstidspunkt).isSameOrAfter(skjæringstidspunkt) &&
            dayjs(inntektsgrunnlag.skjaeringstidspunkt).isSameOrBefore(periodeTom),
    ) ??
    (() => {
        throw Error('Fant ikke inntektsgrunnlag');
    })();

export const getVilkårsgrunnlag = (
    person: Person,
    vilkårsgrunnlagId: string,
    skjæringstidspunkt: DateString,
    periodeTom: DateString,
): Vilkarsgrunnlag =>
    person.vilkarsgrunnlaghistorikk
        .find(({ id }) => id === vilkårsgrunnlagId)
        ?.grunnlag.filter(
            (grunnlag) =>
                dayjs(grunnlag.skjaeringstidspunkt).isSameOrAfter(skjæringstidspunkt) &&
                dayjs(grunnlag.skjaeringstidspunkt).isSameOrBefore(periodeTom),
        )
        .pop() ??
    (() => {
        throw Error('Fant ikke vilkårsgrunnlag');
    })();

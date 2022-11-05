import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';

import { Arbeidsgiverinntekt, GhostPeriode, Inntektskilde, Vilkarsgrunnlag } from '@io/graphql';
import { getRequiredTimestamp, isGodkjent } from '@state/selectors/utbetaling';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

dayjs.extend(minMax);

export const getRequiredInntekt = (
    vilkårsgrunnlag: Vilkarsgrunnlag,
    organisasjonsnummer: string
): Arbeidsgiverinntekt =>
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

const bySkjæringstidspunktDescending = (a: Vilkarsgrunnlag, b: Vilkarsgrunnlag): number => {
    return new Date(b.skjaeringstidspunkt).getTime() - new Date(a.skjaeringstidspunkt).getTime();
};

// TODO: Fjern denne når ghostperioder peker på riktig vilkårsgrunnlag i spleis
export const getFuzzyMatchedVilkårsgrunnlag = (
    person: FetchedPerson,
    grunnlagId: string,
    tom: DateString,
    skjæringstidspunkt: DateString
): Maybe<Vilkarsgrunnlag> => {
    return (
        person.vilkarsgrunnlaghistorikk
            .find(({ id }) => id === grunnlagId)
            ?.grunnlag.filter(
                ({ skjaeringstidspunkt }) =>
                    dayjs(skjaeringstidspunkt).isSameOrAfter(skjæringstidspunkt) &&
                    dayjs(skjaeringstidspunkt).isSameOrBefore(tom)
            )
            .sort(bySkjæringstidspunktDescending)
            .pop() ?? null
    );
};

export const getVilkårsgrunnlag = (person: FetchedPerson, grunnlagId?: Maybe<string>): Vilkarsgrunnlag | null => {
    return person.vilkarsgrunnlag.find(({ id }) => id === grunnlagId) ?? null;
};

export const getRequiredVilkårsgrunnlag = (person: FetchedPerson, grunnlagId?: Maybe<string>): Vilkarsgrunnlag => {
    return (
        getVilkårsgrunnlag(person, grunnlagId) ??
        (() => {
            throw Error('Fant ikke vilkårsgrunnlag');
        })()
    );
};

const hasGhostPeriod = (person: FetchedPerson, period: GhostPeriode): boolean => {
    return (
        person.arbeidsgivere.flatMap(({ ghostPerioder }) => ghostPerioder).find(({ id }) => id === period.id) !==
        undefined
    );
};

const hasRegularPeriod = (person: FetchedPerson, period: FetchedBeregnetPeriode | UberegnetPeriode): boolean => {
    return (
        person.arbeidsgivere
            .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner.flatMap((generasjon) => generasjon.perioder))
            .find(({ id }) => id === period.id) !== undefined
    );
};

export const hasPeriod = (person: FetchedPerson, period: ActivePeriod): boolean => {
    if (isGhostPeriode(period)) {
        return hasGhostPeriod(person, period);
    }

    return hasRegularPeriod(person, period);
};

export const getLatestUtbetalingTimestamp = (person: FetchedPerson, after: DateString = '1970-01-01'): Dayjs => {
    let latest = dayjs(after);

    for (const arbeidsgiver of person.arbeidsgivere) {
        for (const periode of arbeidsgiver.generasjoner[0]?.perioder ?? []) {
            if (isBeregnetPeriode(periode) && isGodkjent(periode.utbetaling)) {
                latest = dayjs.max(dayjs(getRequiredTimestamp(periode.utbetaling)), latest);
            }
        }
    }

    return latest;
};

export const getOverstyringer = (person: FetchedPerson, after: Dayjs) => {
    return person.arbeidsgivere
        .flatMap(({ overstyringer }) => overstyringer)
        .filter((overstyring) => dayjs(overstyring.timestamp).isAfter(after));
};

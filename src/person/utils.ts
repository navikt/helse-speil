import dayjs, { Dayjs } from 'dayjs';

import { ActivePeriod, DateString } from '@/types/shared';
import {
    Arbeidsgiverinntekt,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Inntektskilde,
    PersonFragment,
    UberegnetPeriodeFragment,
    Vilkarsgrunnlag,
} from '@io/graphql';
import { getRequiredTimestamp, isGodkjent } from '@state/selectors/utbetaling';
import { Maybe } from '@utils/ts';
import { isBeregnetPeriode, isDagoverstyring, isGhostPeriode } from '@utils/typeguards';

export const getRequiredInntekt = (
    vilkårsgrunnlag: Vilkarsgrunnlag,
    organisasjonsnummer: string,
): Arbeidsgiverinntekt =>
    vilkårsgrunnlag.inntekter.find((it) => it.arbeidsgiver === organisasjonsnummer) ??
    (() => {
        throw Error('Fant ikke inntekt');
    })();

export const getInntektFraInntektsmelding = (
    grunnlag: Vilkarsgrunnlag,
    organisasjonsnummer: string,
): Arbeidsgiverinntekt | null => {
    return (
        grunnlag.inntekter.find(
            (it) =>
                it.arbeidsgiver === organisasjonsnummer &&
                it.omregnetArsinntekt?.kilde === Inntektskilde.Inntektsmelding,
        ) ?? null
    );
};

export const getInntektFraAOrdningen = (
    grunnlag: Vilkarsgrunnlag,
    organisasjonsnummer: string,
): Arbeidsgiverinntekt | null => {
    return (
        grunnlag.inntekter.find(
            (it) =>
                it.arbeidsgiver === organisasjonsnummer && it.omregnetArsinntekt?.kilde === Inntektskilde.Aordningen,
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

export const getVilkårsgrunnlag = (person: PersonFragment, grunnlagId?: Maybe<string>): Vilkarsgrunnlag | null => {
    return person.vilkarsgrunnlag.find(({ id }) => id === grunnlagId) ?? null;
};

export const getRequiredVilkårsgrunnlag = (person: PersonFragment, grunnlagId?: Maybe<string>): Vilkarsgrunnlag => {
    return (
        getVilkårsgrunnlag(person, grunnlagId) ??
        (() => {
            throw Error('Fant ikke vilkårsgrunnlag');
        })()
    );
};

const hasGhostPeriod = (person: PersonFragment, period: GhostPeriodeFragment): boolean => {
    return (
        person.arbeidsgivere.flatMap(({ ghostPerioder }) => ghostPerioder).find(({ id }) => id === period.id) !==
        undefined
    );
};

const hasRegularPeriod = (
    person: PersonFragment,
    period: BeregnetPeriodeFragment | UberegnetPeriodeFragment,
): boolean => {
    return (
        person.arbeidsgivere
            .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner.flatMap((generasjon) => generasjon.perioder))
            .find(({ id }) => id === period.id) !== undefined
    );
};

export const hasPeriod = (person: PersonFragment, period: ActivePeriod): boolean => {
    if (isGhostPeriode(period)) {
        return hasGhostPeriod(person, period);
    }

    return hasRegularPeriod(person, period);
};

export const getLatestUtbetalingTimestamp = (person: PersonFragment, after: DateString = '1970-01-01'): Dayjs => {
    let latest: Dayjs = dayjs(after);

    for (const arbeidsgiver of person.arbeidsgivere) {
        for (const periode of arbeidsgiver.generasjoner[0]?.perioder ?? []) {
            if (isBeregnetPeriode(periode) && isGodkjent(periode.utbetaling)) {
                latest = dayjs.max(dayjs(getRequiredTimestamp(periode.utbetaling)), latest) as Dayjs;
            }
        }
    }

    return latest;
};

export const getOverstyringerForEksisterendePerioder = (person: PersonFragment, after: Dayjs) => {
    const perioder = person.arbeidsgivere.flatMap((it) => it.generasjoner.flatMap((generasjon) => generasjon.perioder));

    return person.arbeidsgivere
        .flatMap(({ overstyringer }) => overstyringer)
        .filter((overstyring) => dayjs(overstyring.timestamp).isAfter(after))
        .filter((overstyring) => {
            if (isDagoverstyring(overstyring)) {
                // Ser om dagoverstyringen gjelder for en periode som fortsatt finnes (at den ikke er kastet ut til infotrygd med overstyringen hengende igjen f.eks.)
                return (
                    perioder.filter(
                        (periode) =>
                            dayjs(overstyring.dager[0].dato).isSameOrAfter(periode.fom) &&
                            dayjs(overstyring.dager[0].dato).isSameOrBefore(periode.tom),
                    ).length !== 0
                );
            }
            return true;
        });
};

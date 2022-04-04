import dayjs from 'dayjs';

import { usePerson } from '@state/person';
import { useMaybeAktivPeriode } from '@state/tidslinje';

import type { UtbetalingToggles } from '@utils/featureToggles';
import { useActivePeriod } from '@state/periodState';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiverState';
import { isBeregnetPeriode } from '@utils/typeguards';
import { BeregnetPeriode } from '@io/graphql';

const godkjentTilstander: PeriodState[] = ['utbetalt', 'utbetaltAutomatisk', 'revurdert', 'revurdertIngenUtbetaling'];

const tidslinjeperioderISisteGenerasjon = (
    person: Person,
    periode: TidslinjeperiodeMedSykefravær,
): TidslinjeperiodeMedSykefravær[] =>
    person.arbeidsgivere
        .map((it) => it.tidslinjeperioder)
        .filter((it) => it.length > 0)
        .flatMap((it) => it[0]);

const periodeFinnesISisteGenerasjon = (person: Person, periode: TidslinjeperiodeMedSykefravær): boolean =>
    tidslinjeperioderISisteGenerasjon(person, periode).find(
        (it) => it.id === periode.id && it.beregningId === periode.beregningId && it.unique === periode.unique,
    ) !== undefined;

const arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden = (
    person: Person,
    periode: TidslinjeperiodeMedSykefravær,
): boolean => {
    if (!periode.skjæringstidspunkt) return false;

    const periodenFinnesISisteGenerasjon = periodeFinnesISisteGenerasjon(person, periode);

    if (!periodenFinnesISisteGenerasjon) return false;

    const arbeidsgiver = person.arbeidsgivere.find((arb) => arb.organisasjonsnummer === periode.organisasjonsnummer);
    const sistePeriode = arbeidsgiver?.tidslinjeperioder[0].filter((it) => it.fullstendig)[0];

    if (!sistePeriode?.skjæringstidspunkt) return false;

    return dayjs(sistePeriode.skjæringstidspunkt).isSame(periode.skjæringstidspunkt, 'day');
};

const overlapper = (periode: TidslinjeperiodeMedSykefravær, other: TidslinjeperiodeMedSykefravær) =>
    (periode.fom.isSameOrAfter(other.fom) && periode.fom.isSameOrBefore(other.tom)) ||
    (periode.tom.isSameOrAfter(other.fom) && periode.tom.isSameOrBefore(other.tom));

const alleTidslinjeperioder = (person: Person) =>
    person.arbeidsgivere.flatMap(
        (arbeidsgiver) => arbeidsgiver.tidslinjeperioder?.[0]?.map((periode) => periode) ?? [],
    );

const overlappendePerioder = (person: Person, periode: TidslinjeperiodeMedSykefravær) =>
    alleTidslinjeperioder(person).filter((it) => overlapper(it, periode));

const alleOverlappendePerioderErAvsluttet = (person: Person, aktivPeriode: TidslinjeperiodeMedSykefravær): boolean => {
    const overlappende = overlappendePerioder(person, aktivPeriode);

    if (overlappende.some((it) => godkjentTilstander.includes(it.tilstand))) {
        return overlappende.every((it) => it.tilstand !== 'revurderes');
    }
    return true;
};

const alleOverlappendePerioderErTilRevurdering = (
    person: Person,
    aktivPeriode: TidslinjeperiodeMedSykefravær,
): boolean => {
    const overlappende = overlappendePerioder(person, aktivPeriode);

    if (overlappende.some((it) => it.tilstand === 'revurderes')) {
        return overlappende.every((it) => it.tilstand === 'revurderes');
    }

    return true;
};

export const useRevurderingIsEnabled = (toggles: UtbetalingToggles): boolean => {
    const periode = useMaybeAktivPeriode();
    const person = usePerson();

    if (!person || !periode || !godkjentTilstander.includes(periode.tilstand)) {
        return false;
    }

    return (
        toggles.overstyreUtbetaltPeriodeEnabled &&
        alleOverlappendePerioderErAvsluttet(person, periode as TidslinjeperiodeMedSykefravær) &&
        arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden(
            person,
            periode as TidslinjeperiodeMedSykefravær,
        )
    );
};

export const useOverstyrRevurderingIsEnabled = (toggles: UtbetalingToggles) => {
    const periode = useMaybeAktivPeriode();
    const person = usePerson();

    if (!person || !periode || periode.tilstand !== 'revurderes') {
        return false;
    }

    return (
        toggles.overstyreUtbetaltPeriodeEnabled &&
        alleOverlappendePerioderErTilRevurdering(person, periode as TidslinjeperiodeMedSykefravær) &&
        arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden(
            person,
            periode as TidslinjeperiodeMedSykefravær,
        )
    );
};

export const useActiveGenerationIsLast = (): boolean => {
    const period = useActivePeriod();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!arbeidsgiver || !isBeregnetPeriode(period)) {
        return false;
    }

    return arbeidsgiver.generasjoner[0].perioder.some((it) => (it as BeregnetPeriode).id === period.id);
};

export const useHarIngenUtbetaltePerioderFor = (skjæringstidspunkt: string): boolean => {
    const person = usePerson();
    return (
        person?.arbeidsgivere.every((arbeidsgiver) => {
            return arbeidsgiver.tidslinjeperioder
                .flat()
                .filter((periode) => periode.skjæringstidspunkt === skjæringstidspunkt)
                .every((periode) => periode.tilstand === 'oppgaver' || periode.tilstand === 'venter');
        }) ?? false
    );
};

export const useActivePeriodHasLatestSkjæringstidspunkt = (): boolean => {
    const period = useActivePeriod();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!period || !arbeidsgiver || !isBeregnetPeriode(period)) {
        return false;
    }

    const lastBeregnetPeriode = arbeidsgiver.generasjoner[0].perioder.filter(isBeregnetPeriode)[0];

    return lastBeregnetPeriode !== undefined && lastBeregnetPeriode.skjaeringstidspunkt === period.skjaeringstidspunkt;
};

export const useHarKunEnFagsystemIdPåArbeidsgiverIAktivPeriode = (): boolean => {
    const arbeidsgiver = useCurrentArbeidsgiver();
    const periode = useActivePeriod();

    if (!isBeregnetPeriode(periode) || !arbeidsgiver) {
        return false;
    }

    return (
        Object.keys(
            groupByFagsystemId(
                arbeidsgiver.generasjoner[0]?.perioder
                    .filter(isBeregnetPeriode)
                    .filter((it) => it.skjaeringstidspunkt === periode.skjaeringstidspunkt),
            ),
        ).length === 1 ?? false
    );
};

type GroupByResult = Record<string, Array<BeregnetPeriode>>;

const groupByFagsystemId = (perioder: Array<BeregnetPeriode>): GroupByResult => {
    return perioder.reduce((result, it: BeregnetPeriode) => {
        const fagsystemId = it.utbetaling.arbeidsgiverFagsystemId;
        if (!result[fagsystemId]) {
            result[fagsystemId] = [];
        }
        result[fagsystemId].push(it);
        return result;
    }, {} as GroupByResult);
};

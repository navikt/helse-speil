import dayjs from 'dayjs';

import { useArbeidsgiver } from '../modell/arbeidsgiver';

import { usePerson } from '@state/person';
import { useAktivPeriode, useMaybeAktivPeriode } from '@state/tidslinje';

import type { UtbetalingToggles } from '@utils/featureToggles';

const godkjentTilstander: Tidslinjetilstand[] = [
    'utbetalt',
    'utbetaltAutomatisk',
    'revurdert',
    'revurdertIngenUtbetaling',
];

const tidslinjeperioderISisteGenerasjon = (
    person: Person,
    periode: TidslinjeperiodeMedSykefravær
): TidslinjeperiodeMedSykefravær[] =>
    person.arbeidsgivere
        .map((it) => it.tidslinjeperioder)
        .filter((it) => it.length > 0)
        .flatMap((it) => it[0]);

const periodeFinnesISisteGenerasjon = (person: Person, periode: TidslinjeperiodeMedSykefravær): boolean =>
    tidslinjeperioderISisteGenerasjon(person, periode).find(
        (it) => it.id === periode.id && it.beregningId === periode.beregningId && it.unique === periode.unique
    ) !== undefined;

const arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden = (
    person: Person,
    periode: TidslinjeperiodeMedSykefravær
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
        (arbeidsgiver) => arbeidsgiver.tidslinjeperioder?.[0]?.map((periode) => periode) ?? []
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
    aktivPeriode: TidslinjeperiodeMedSykefravær
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
            periode as TidslinjeperiodeMedSykefravær
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
            periode as TidslinjeperiodeMedSykefravær
        )
    );
};

export const useErTidslinjeperiodeISisteGenerasjon = (): boolean => {
    const periode = useAktivPeriode();
    const person = usePerson();

    if (!person) throw Error('Forventet person, men fant ingen');
    if (periode.tilstand === 'utenSykefravær') return false;

    return periodeFinnesISisteGenerasjon(person, periode as TidslinjeperiodeMedSykefravær);
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

export const useErAktivPeriodeISisteSkjæringstidspunkt = (): boolean => {
    const periode = useMaybeAktivPeriode();
    const person = usePerson();

    if (!person || !periode || periode.tilstand === 'utenSykefravær') {
        return false;
    }

    return arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden(
        person,
        periode as TidslinjeperiodeMedSykefravær
    );
};

export const useHarKunEnFagsystemIdPåArbeidsgiverIAktivPeriode = (): boolean => {
    const arbeidsgiver = useArbeidsgiver();
    const aktivPeriode = useAktivPeriode();

    if (aktivPeriode.tilstand === 'utenSykefravær' || arbeidsgiver.tidslinjeperioder.length == 0) {
        return false;
    }
    return (
        Object.keys(
            groupBy(
                arbeidsgiver.tidslinjeperioder[0].filter(
                    (it) =>
                        it.skjæringstidspunkt === (aktivPeriode as TidslinjeperiodeMedSykefravær)?.skjæringstidspunkt
                ),
                'fagsystemId'
            )
        ).length === 1 ?? false
    );
};

const groupBy = (xs: any[], key: string): any[] => {
    return xs.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

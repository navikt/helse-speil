import dayjs from 'dayjs';

import { useArbeidsgiver } from '../modell/arbeidsgiver';
import { usePerson } from '../state/person';
import { useAktivPeriode, useMaybeAktivPeriode } from '../state/tidslinje';

import type { UtbetalingToggles } from '../featureToggles';

const godkjentTilstander: Tidslinjetilstand[] = [
    'utbetalt',
    'utbetaltAutomatisk',
    'revurdert',
    'revurdertIngenUtbetaling',
];

const tidslinjeperioderISisteGenerasjon = (person: Person, periode: Tidslinjeperiode): Tidslinjeperiode[] =>
    person.arbeidsgivere
        .map((it) => it.tidslinjeperioder)
        .filter((it) => it.length > 0)
        .flatMap((it) => it[0]);

const periodeFinnesISisteGenerasjon = (person: Person, periode: Tidslinjeperiode): boolean =>
    tidslinjeperioderISisteGenerasjon(person, periode).find(
        (it) => it.id === periode.id && it.beregningId === periode.beregningId && it.unique === periode.unique
    ) !== undefined;

const arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden = (
    person: Person,
    periode: Tidslinjeperiode
): boolean => {
    if (!periode.skjæringstidspunkt) return false;

    const periodenFinnesISisteGenerasjon = periodeFinnesISisteGenerasjon(person, periode);

    if (!periodenFinnesISisteGenerasjon) return false;

    const arbeidsgiver = person.arbeidsgivere.find((arb) => arb.organisasjonsnummer === periode.organisasjonsnummer);
    const sistePeriode = arbeidsgiver?.tidslinjeperioder[0].filter((it) => it.fullstendig)[0];

    if (!sistePeriode?.skjæringstidspunkt) return false;

    return dayjs(sistePeriode.skjæringstidspunkt).isSame(periode.skjæringstidspunkt, 'day');
};

const overlapper = (periode: Tidslinjeperiode, other: Tidslinjeperiode) =>
    (periode.fom.isSameOrAfter(other.fom) && periode.fom.isSameOrBefore(other.tom)) ||
    (periode.tom.isSameOrAfter(other.fom) && periode.tom.isSameOrBefore(other.tom));

const alleTidslinjeperioder = (person: Person) =>
    person.arbeidsgivere.flatMap(
        (arbeidsgiver) => arbeidsgiver.tidslinjeperioder?.[0]?.map((periode) => periode) ?? []
    );

const overlappendePerioder = (person: Person, periode: Tidslinjeperiode) =>
    alleTidslinjeperioder(person).filter((it) => overlapper(it, periode));

const alleOverlappendePerioderErAvsluttet = (person: Person, aktivPeriode: Tidslinjeperiode): boolean => {
    const overlappende = overlappendePerioder(person, aktivPeriode);

    if (overlappende.some((it) => godkjentTilstander.includes(it.tilstand))) {
        return overlappende.every((it) => it.tilstand !== 'revurderes');
    }
    return true;
};

const alleOverlappendePerioderErTilRevurdering = (person: Person, aktivPeriode: Tidslinjeperiode): boolean => {
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
        alleOverlappendePerioderErAvsluttet(person, periode) &&
        arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden(person, periode)
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
        alleOverlappendePerioderErTilRevurdering(person, periode) &&
        arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden(person, periode)
    );
};

export const useErTidslinjeperiodeISisteGenerasjon = (): boolean => {
    const periode = useAktivPeriode();
    const person = usePerson();

    if (!person) throw Error('Forventet person, men fant ingen');

    return periodeFinnesISisteGenerasjon(person, periode);
};

export const useErAktivPeriodeISisteSkjæringstidspunkt = (): boolean => {
    const periode = useMaybeAktivPeriode();
    const person = usePerson();

    if (!person || !periode) {
        return false;
    }

    return arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden(person, periode);
};

export const useHarKunEnFagsystemIdPåArbeidsgiverIAktivPeriode = (): boolean => {
    const arbeidsgiver = useArbeidsgiver();
    const aktivPeriode = useAktivPeriode();

    return (
        Object.keys(
            groupBy(
                arbeidsgiver.tidslinjeperioder[0].filter(
                    (it) => it.skjæringstidspunkt === aktivPeriode.skjæringstidspunkt
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

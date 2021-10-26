import dayjs from 'dayjs';

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

const arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden = (
    person: Person,
    periode: Tidslinjeperiode
): boolean => {
    if (!periode.skjæringstidspunkt) return false;

    const alleTidslinjeperioderISisteGenerasjon = tidslinjeperioderISisteGenerasjon(person, periode);
    const periodeFinnesISisteGenerasjon = alleTidslinjeperioderISisteGenerasjon.find(
        (it) => it.id === periode.id && it.beregningId === periode.beregningId && it.unique === periode.unique
    );

    if (!periodeFinnesISisteGenerasjon) return false;

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

export const useErAktivPeriodeISisteBehandledeSkjæringstidspunkt = (): boolean => {
    const periode = useAktivPeriode();
    const person = usePerson();

    if (!person) throw Error('Forventet person, men fant ingen');

    return (
        tidslinjeperioderISisteGenerasjon(person, periode)
            .filter((it) => dayjs(it.skjæringstidspunkt).isAfter(periode.skjæringstidspunkt))
            .filter((it) => !['oppgaver', 'venter', 'venterPåKiling'].includes(it.tilstand)).length === 0
    );
};

export const useErAktivPeriodeISisteSkjæringstidspunkt = (): boolean => {
    const periode = useMaybeAktivPeriode();
    const person = usePerson();

    if (!person || !periode) {
        return false;
    }

    return arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden(person, periode);
};

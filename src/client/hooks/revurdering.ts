import { usePerson } from '../state/person';
import { useAktivPeriode } from '../state/tidslinje';

import type { UtbetalingToggles } from '../featureToggles';

const godkjentTilstander: Tidslinjetilstand[] = [
    'utbetalt',
    'utbetaltAutomatisk',
    'revurdert',
    'revurdertIngenUtbetaling',
];

const arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden = (
    person: Person,
    periode: Tidslinjeperiode
) => {
    const alleTidslinjeperioder = person.arbeidsgivere.map((it) => it.tidslinjeperioder).filter((it) => it.length > 0);
    const alleTidslinjeperioderISisteGenerasjon = alleTidslinjeperioder.flatMap((it) => it[0]);
    const periodeFinnesISisteGenerasjon = alleTidslinjeperioderISisteGenerasjon.find(
        (it) => it.id === periode.id && it.beregningId === periode.beregningId && it.unique === periode.unique
    );

    if (!periodeFinnesISisteGenerasjon) return false;

    const vedtaksperiode = person.arbeidsgivere
        .flatMap((it) => it.vedtaksperioder)
        .filter((it) => it.fullstendig)
        .find((it) => it.id === periode.id) as Vedtaksperiode;

    const arbeidsgiver = person.arbeidsgivere.find((arb) => arb.organisasjonsnummer === periode.organisasjonsnummer);
    const periodensSkjæringstidspunkt = vedtaksperiode?.vilkår?.dagerIgjen.skjæringstidspunkt;
    const arbeidsgiversSisteTidslinjeperiode = arbeidsgiver?.tidslinjeperioder[0].filter((it) => it.fullstendig)[0];

    const sisteVedtaksperiodeForArbeidsgiver = person.arbeidsgivere
        .flatMap((it) => it.vedtaksperioder)
        .filter((it) => it.fullstendig)
        .map((it) => it as Vedtaksperiode)
        .find((it) => it.id === arbeidsgiversSisteTidslinjeperiode?.id);

    const arbeidsgiversSisteSkjæringstidspunkt =
        sisteVedtaksperiodeForArbeidsgiver?.vilkår?.dagerIgjen.skjæringstidspunkt;
    if (!periodensSkjæringstidspunkt) return false;
    return arbeidsgiversSisteSkjæringstidspunkt?.isSame(periodensSkjæringstidspunkt, 'day') ?? false;
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
    const periode = useAktivPeriode();
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
    const periode = useAktivPeriode();
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

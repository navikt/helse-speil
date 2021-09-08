import { Person, Tidslinjetilstand, Vedtaksperiode } from 'internal-types';

import { Tidslinjeperiode } from '../modell/utbetalingshistorikkelement';
import { usePerson } from '../state/person';
import { useAktivPeriode } from '../state/tidslinje';

import { erDev, erLocal, UtbetalingToggles } from '../featureToggles';

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

const kunEnArbeidsgiver = (person: Person) => person.arbeidsgivere.length === 1;

const revurderingIsEnabled = (person: Person, periode: Tidslinjeperiode, toggles: UtbetalingToggles): boolean =>
    toggles.overstyreUtbetaltPeriodeEnabled &&
    (erDev() || erLocal() || kunEnArbeidsgiver(person)) &&
    arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden(person, periode) &&
    [
        Tidslinjetilstand.Utbetalt,
        Tidslinjetilstand.UtbetaltAutomatisk,
        Tidslinjetilstand.Revurdert,
        Tidslinjetilstand.RevurdertIngenUtbetaling,
    ].includes(periode.tilstand);

export const useRevurderingIsEnabled = (toggles: UtbetalingToggles): boolean => {
    const periode = useAktivPeriode();
    const person = usePerson();

    return person !== undefined && periode !== undefined && revurderingIsEnabled(person, periode, toggles);
};

import dayjs from 'dayjs';

import { Arbeidsgiver, BeregnetPeriode, GhostPeriode, Periode } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { getArbeidsgiverWithPeriod } from '@state/selectors/arbeidsgiver';
import { isForkastet, isGodkjent, overlapper } from '@state/selectors/period';
import { UtbetalingToggles } from '@utils/featureToggles';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode } from '@utils/typeguards';

const periodeErIArbeidsgiversSisteSkjæringstidspunkt = (
    arbeidsgiver: Arbeidsgiver,
    periode: FetchedBeregnetPeriode
): boolean => {
    const periodenFinnesISisteGenerasjon =
        arbeidsgiver.generasjoner[0]?.perioder.find((it) => it === periode) !== undefined;

    if (!periodenFinnesISisteGenerasjon) return false;

    const sistePeriode = arbeidsgiver.generasjoner[0]?.perioder.filter(isBeregnetPeriode)[0];

    if (!sistePeriode || typeof sistePeriode?.skjaeringstidspunkt !== 'string') {
        return false;
    }

    return dayjs(sistePeriode.skjaeringstidspunkt).isSame(periode.skjaeringstidspunkt, 'day');
};

const getOverlappendePerioder = (person: FetchedPerson, periode: FetchedBeregnetPeriode): Array<BeregnetPeriode> =>
    person.arbeidsgivere
        .flatMap(
            (arbeidsgiver) =>
                (arbeidsgiver.generasjoner[0]?.perioder.filter(isBeregnetPeriode) as Array<BeregnetPeriode>) ?? []
        )
        .filter(overlapper(periode));

const alleOverlappendePerioderErAvsluttet = (person: FetchedPerson, periode: Periode | GhostPeriode): boolean => {
    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    const overlappendePerioder = getOverlappendePerioder(person, periode);

    if (overlappendePerioder.some(isGodkjent)) {
        return overlappendePerioder.every((it) => getPeriodState(it) !== 'revurderes');
    }

    return true;
};

const alleOverlappendePerioderErTilRevurdering = (person: FetchedPerson, periode: Periode): boolean => {
    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    const overlappendeTilstander: Array<PeriodState> = getOverlappendePerioder(person, periode).map(getPeriodState);

    if (overlappendeTilstander.some((it) => it === 'revurderes')) {
        return overlappendeTilstander.every((it) => it === 'revurderes');
    }

    return true;
};

export const useRevurderingIsEnabled = (toggles: UtbetalingToggles): boolean => {
    const periode = useActivePeriod();
    const person = useCurrentPerson();

    if (!person || !isBeregnetPeriode(periode) || !isGodkjent(periode)) {
        return false;
    }

    const arbeidsgiver = getArbeidsgiverWithPeriod(person, periode);

    if (arbeidsgiver === null) return false;
    if (isForkastet(periode)) return false;
    if (!toggles.overstyreUtbetaltPeriodeEnabled) return false;
    if (!alleOverlappendePerioderErAvsluttet(person, periode)) return false;
    return (
        toggles.overstyreTidligereSykefraværstilfelle ||
        periodeErIArbeidsgiversSisteSkjæringstidspunkt(arbeidsgiver, periode)
    );
};

export const useOverstyrRevurderingIsEnabled = (toggles: UtbetalingToggles) => {
    const periode = useActivePeriod();
    const person = useCurrentPerson();
    const periodState = getPeriodState(periode);

    if (!person || !isBeregnetPeriode(periode) || periodState !== 'revurderes') {
        return false;
    }

    const arbeidsgiver = getArbeidsgiverWithPeriod(person, periode);

    return (
        arbeidsgiver !== null &&
        toggles.overstyreUtbetaltPeriodeEnabled &&
        alleOverlappendePerioderErTilRevurdering(person, periode) &&
        periodeErIArbeidsgiversSisteSkjæringstidspunkt(arbeidsgiver, periode)
    );
};

export const useActivePeriodHasLatestSkjæringstidspunkt = (): boolean => {
    const period = useActivePeriod();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!period || !arbeidsgiver || !isBeregnetPeriode(period)) {
        return false;
    }

    const lastBeregnetPeriode = arbeidsgiver.generasjoner[0]?.perioder.filter(isBeregnetPeriode)[0];

    return lastBeregnetPeriode !== undefined && lastBeregnetPeriode.skjaeringstidspunkt === period.skjaeringstidspunkt;
};

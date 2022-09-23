import dayjs from 'dayjs';

import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useCurrentPerson } from '@state/person';
import { useActivePeriod } from '@state/periode';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode, isForkastetPeriode } from '@utils/typeguards';
import type { UtbetalingToggles } from '@utils/featureToggles';
import type { Arbeidsgiver, BeregnetPeriode, GhostPeriode, Periode, Person } from '@io/graphql';
import { erDev, erLocal } from '@utils/featureToggles';
import { isRevurdering } from '@utils/period';

const godkjentTilstander: PeriodState[] = ['utbetalt', 'utbetaltAutomatisk', 'revurdert', 'revurdertIngenUtbetaling'];

const periodeErIArbeidsgiversSisteSkjæringstidspunkt = (
    arbeidsgiver: Arbeidsgiver,
    periode: BeregnetPeriode,
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

const overlapper =
    (other: Periode) =>
    (periode: Periode): boolean =>
        (dayjs(periode.fom).isSameOrAfter(other.fom) && dayjs(periode.fom).isSameOrBefore(other.tom)) ||
        (dayjs(periode.tom).isSameOrAfter(other.fom) && dayjs(periode.tom).isSameOrBefore(other.tom));

const overlappendePerioder = (person: Person, periode: BeregnetPeriode): Array<BeregnetPeriode> =>
    person.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder.filter(isBeregnetPeriode) ?? [])
        .filter(overlapper(periode));

const alleOverlappendePerioderErAvsluttet = (person: Person, periode: Periode | GhostPeriode): boolean => {
    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    const overlappendeTilstander: Array<PeriodState> = overlappendePerioder(person, periode).map(getPeriodState);

    if (overlappendeTilstander.some((it) => godkjentTilstander.includes(it))) {
        return overlappendeTilstander.every((it) => it !== 'revurderes');
    }

    return true;
};

const harOverlappendePeriodeSomErErAvsluttet = (person: Person, periode: Periode | GhostPeriode): boolean => {
    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    const overlappendePerioder = person.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder.filter(isBeregnetPeriode) ?? [])
        .filter((other) => other.vedtaksperiodeId !== periode.vedtaksperiodeId)
        .filter(overlapper(periode));

    const overlappendeTilstander: Array<PeriodState> = overlappendePerioder.map(getPeriodState);

    return overlappendeTilstander.some((tilstand) => godkjentTilstander.includes(tilstand));
};

const alleOverlappendePerioderErTilRevurdering = (person: Person, periode: Periode): boolean => {
    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    const overlappendeTilstander: Array<PeriodState> = overlappendePerioder(person, periode).map(getPeriodState);

    if (overlappendeTilstander.some((it) => it === 'revurderes')) {
        return overlappendeTilstander.every((it) => it === 'revurderes');
    }

    return true;
};

export const useFørstegangsbehandlingTilGodkjenningMedOverlappendeAvsluttetPeriode = (
    periode: Periode | GhostPeriode,
    person: Person,
): boolean => {
    const førstegangsbehandlingMedTilstandAvventerGodkjenning =
        getPeriodState(periode) === 'tilGodkjenning' && isBeregnetPeriode(periode) && !isRevurdering(periode);
    return (
        harOverlappendePeriodeSomErErAvsluttet(person, periode) && førstegangsbehandlingMedTilstandAvventerGodkjenning
    );
};

const getArbeidsgiverMedPeriode = (periode: Periode, person: Person): Arbeidsgiver | null => {
    return person.arbeidsgivere.find((it) => it.generasjoner[0]?.perioder.find((it) => it === periode)) ?? null;
};

export const useRevurderingIsEnabled = (toggles: UtbetalingToggles): boolean => {
    const periode = useActivePeriod();
    const person = useCurrentPerson();
    const periodState = getPeriodState(periode);

    if (!person || !isBeregnetPeriode(periode) || !godkjentTilstander.includes(periodState)) {
        return false;
    }

    const arbeidsgiver = getArbeidsgiverMedPeriode(periode, person);

    if (arbeidsgiver === null) return false;
    if (isForkastetPeriode(periode)) return false;
    if (!toggles.overstyreUtbetaltPeriodeEnabled) return false;
    if (!alleOverlappendePerioderErAvsluttet(person, periode)) return false;
    if (!(erDev() || erLocal()) && !periodeErIArbeidsgiversSisteSkjæringstidspunkt(arbeidsgiver, periode)) return false;

    return true;
};

export const useOverstyrRevurderingIsEnabled = (toggles: UtbetalingToggles) => {
    const periode = useActivePeriod();
    const person = useCurrentPerson();
    const periodState = getPeriodState(periode);

    if (!person || !isBeregnetPeriode(periode) || periodState !== 'revurderes') {
        return false;
    }

    const arbeidsgiver = getArbeidsgiverMedPeriode(periode, person);

    return (
        arbeidsgiver !== null &&
        toggles.overstyreUtbetaltPeriodeEnabled &&
        alleOverlappendePerioderErTilRevurdering(person, periode) &&
        periodeErIArbeidsgiversSisteSkjæringstidspunkt(arbeidsgiver, periode)
    );
};

export const useActiveGenerationIsLast = (): boolean => {
    const period = useActivePeriod();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!arbeidsgiver || !isBeregnetPeriode(period)) {
        return false;
    }

    return arbeidsgiver.generasjoner[0]?.perioder.some((it) => (it as BeregnetPeriode).id === period.id);
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

export const useHarKunEnFagsystemIdPåArbeidsgiverIAktivPeriode = (): boolean => {
    const arbeidsgiver = useCurrentArbeidsgiver();
    const periode = useActivePeriod();

    if (!isBeregnetPeriode(periode) || !arbeidsgiver) {
        return false;
    }

    const beregnedePerioder = arbeidsgiver.generasjoner[0]?.perioder
        .filter(isBeregnetPeriode)
        .filter((it) => it.skjaeringstidspunkt === periode.skjaeringstidspunkt);

    const fagsystemIder = new Set<string>();

    for (const periode of beregnedePerioder) {
        fagsystemIder.add(periode.utbetaling.arbeidsgiverFagsystemId);
    }

    return fagsystemIder.size === 1;
};

const byFomDescending = (a: Periode, b: Periode): number => {
    return new Date(b.fom).getTime() - new Date(a.fom).getTime();
};

export const useActivePeriodHasLatestFagsystemIdForSkjæringstidspunkt = (): boolean => {
    const arbeidsgiver = useCurrentArbeidsgiver();
    const periode = useActivePeriod();

    if (!isBeregnetPeriode(periode) || !arbeidsgiver) return false;

    const fagsystemiderSorted = arbeidsgiver.generasjoner[0]?.perioder
        .filter(isBeregnetPeriode)
        .filter((it) => it.skjaeringstidspunkt === periode.skjaeringstidspunkt)
        .sort(byFomDescending)
        .map((it) => it.utbetaling.arbeidsgiverFagsystemId);

    return periode.utbetaling.arbeidsgiverFagsystemId === fagsystemiderSorted[0];
};

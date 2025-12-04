import dayjs, { Dayjs } from 'dayjs';

import { Periode, Periodetilstand, Periodetype } from '@io/graphql';
import { DatePeriod, DateString } from '@typer/shared';
import { TimelinePeriod } from '@typer/timeline';

const overlaps = (period: DatePeriod, skjæringstidspunkt: DateString): boolean => {
    const date = Date.parse(skjæringstidspunkt);
    const fom = Date.parse(period.fom);
    const tom = Date.parse(period.tom);
    return fom <= date && tom >= date;
};

const periodetype = (period: Periode): Periodetype =>
    period.periodetype === Periodetype.OvergangFraIt
        ? Periodetype.OvergangFraIt
        : overlaps(period, period.skjaeringstidspunkt)
          ? Periodetype.Forstegangsbehandling
          : Periodetype.Forlengelse;

const withinADay = (left: Dayjs, right: Dayjs): boolean =>
    Math.abs(left.startOf('day').diff(right.endOf('day'), 'day')) < 1;

// perioder som ligger inntil visse perioder skal ha butte ender i stedet for skarpe kanter.
// Annullerte perioder har ikke nødvendigvis riktig skjæringstidspunkt, derfor må de ha unntak her.
const kreverButteEnder = (timelinePeriod: TimelinePeriod) => {
    const period = timelinePeriod as unknown as Periode;
    return (
        (periodetype(period) === Periodetype.Forstegangsbehandling ||
            periodetype(period) === Periodetype.OvergangFraIt) &&
        period.periodetilstand !== Periodetilstand.Annullert
    );
};

// Svarer på om perioden på index i har en nabo til venstre for seg OG om den skal "ligge inntil" den, altså om den skal
// ha flat eller butt venstreende.
const hasLeftNeighbour = (i: number, periods: TimelinePeriod[]): boolean => {
    if (i < 1) return false;
    const thisPeriod = periods[i];
    const periodToTheLeft = periods[i - 1];
    if (!periodToTheLeft || !thisPeriod) return false;
    return (
        (withinADay(dayjs(periodToTheLeft.fom), dayjs(thisPeriod.tom)) && !kreverButteEnder(periodToTheLeft)) ?? false
    );
};

// Svarer på om perioden på index i har en nabo til høyre for seg OG om den skal "ligge inntil" den, altså om den skal
// ha flat eller butt høyreende.
const hasRightNeighbour = (i: number, periods: TimelinePeriod[]): boolean => {
    if (i >= periods.length - 1) return false;
    const thisPeriod = periods[i];
    const periodToTheRight = periods[i + 1];
    if (!thisPeriod || !periodToTheRight) return false;
    return withinADay(dayjs(thisPeriod.fom), dayjs(periodToTheRight.tom)) && !kreverButteEnder(thisPeriod);
};

export function usePopulateNeighbours(periods: TimelinePeriod[]): TimelinePeriod[] {
    return periods.map((period, index) => {
        return {
            ...period,
            hasLeftNeighbour: hasLeftNeighbour(index, periods),
            hasRightNeighbour: hasRightNeighbour(index, periods),
            isFirst: index === 0,
        };
    });
}

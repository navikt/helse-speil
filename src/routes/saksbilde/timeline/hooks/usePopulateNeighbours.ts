import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';

import { Periode, Periodetype } from '@io/graphql';

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

const withinADay = (a: Dayjs, b: Dayjs): boolean => Math.abs(a.diff(b, 'day')) < 1;

const isFørstegangsbehandling = (period: TimelinePeriod): boolean => {
    return periodetype(period as unknown as Periode) === Periodetype.Forstegangsbehandling;
};

const isOvergangFraInfotrygd = (period: TimelinePeriod): boolean => {
    return periodetype(period as unknown as Periode) === Periodetype.OvergangFraIt;
};
const hasLeftNeighbour = (i: number, periods: Array<TimelinePeriod>): boolean => {
    return (
        i > 0 &&
        withinADay(dayjs(periods[i - 1].fom).startOf('day'), dayjs(periods[i].tom).endOf('day')) &&
        !isFørstegangsbehandling(periods[i - 1]) &&
        !isOvergangFraInfotrygd(periods[i - 1])
    );
};

const hasRightNeighbour = (i: number, periods: Array<TimelinePeriod>): boolean => {
    return (
        i < periods.length - 1 &&
        withinADay(dayjs(periods[i].fom).startOf('day'), dayjs(periods[i + 1].tom).endOf('day')) &&
        !isFørstegangsbehandling(periods[i]) &&
        !isOvergangFraInfotrygd(periods[i])
    );
};

export const usePopulateNeighbours = (periods: Array<TimelinePeriod>): Array<TimelinePeriod> =>
    useMemo(() => {
        return periods.map((period, index) => {
            return {
                ...period,
                hasLeftNeighbour: hasLeftNeighbour(index, periods),
                hasRightNeighbour: hasRightNeighbour(index, periods),
                isFirst: index === 0,
            };
        });
    }, [periods]);

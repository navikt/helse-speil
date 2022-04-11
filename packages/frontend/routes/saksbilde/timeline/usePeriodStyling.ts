import { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { BeregnetPeriode, Periodetype } from '@io/graphql';

type PeriodBorderRadius = {
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    borderBottomRightRadius?: number;
    borderBottomLeftRadius?: number;
};

type PeriodStyling = PeriodBorderRadius & {
    right: string;
    width: string;
};

type StyledPeriod = {
    fom: Dayjs;
    tom: Dayjs;
    type?: Maybe<Periodetype>;
};

const withinADay = (a: Dayjs, b: Dayjs): boolean => Math.abs(a.diff(b, 'day')) < 1;

const isFørstegangsbehandling = (period: StyledPeriod): boolean => {
    return period.type === Periodetype.Forstegangsbehandling;
};

const hasLeftNeighbour = (i: number, periods: Array<StyledPeriod>): boolean => {
    return i > 0 && withinADay(periods[i - 1].fom, periods[i].tom);
};

const hasRightNeighbour = (i: number, periods: Array<StyledPeriod>): boolean => {
    return i < periods.length - 1 && withinADay(periods[i].fom, periods[i + 1].tom);
};

const getBorderRadii = <T extends StyledPeriod>(period: T, i: number, allPeriods: Array<T>): PeriodBorderRadius => {
    const leftSideRadii =
        hasLeftNeighbour(i, allPeriods) && !isFørstegangsbehandling(allPeriods[i - 1])
            ? {
                  borderBottomLeftRadius: 0,
                  borderTopLeftRadius: 0,
              }
            : undefined;

    const rightSideRadii =
        hasRightNeighbour(i, allPeriods) && !isFørstegangsbehandling(period)
            ? {
                  borderBottomRightRadius: 0,
                  borderTopRightRadius: 0,
              }
            : undefined;

    return {
        ...leftSideRadii,
        ...rightSideRadii,
    };
};

export const getPosition = (date: Dayjs, start: Dayjs, end: Dayjs): number => {
    const diff = end.diff(start);
    const position = (date.diff(start) / diff) * 100;
    return position > 0 ? position : 0;
};

export const usePeriodStyling = <T extends DatePeriod>(
    start: Dayjs,
    end: Dayjs,
    periods: Array<T>,
): Map<number, PeriodStyling> =>
    useMemo(() => {
        const map = new Map<number, PeriodStyling>();
        const datePeriods = periods.map((period) => ({
            fom: dayjs(period.fom).startOf('day'),
            tom: dayjs(period.tom).endOf('day'),
            type: (period as unknown as BeregnetPeriode).periodetype,
        }));

        for (const [i, period] of datePeriods.entries()) {
            const right = getPosition(period.fom, start, end);
            const width = getPosition(period.tom, start, end) - right;
            const borderRadii = getBorderRadii(period, i, datePeriods);

            if (right === 0) {
                borderRadii.borderTopRightRadius = 0;
                borderRadii.borderBottomRightRadius = 0;
            }

            const style = {
                right: `${right}%`,
                width: `${width}%`,
                ...borderRadii,
            };
            map.set(i, style);
        }

        return map;
    }, [start, end, periods]);

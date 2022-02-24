import { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';

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

type DayjsPeriod = {
    fom: Dayjs;
    tom: Dayjs;
};

const withinADay = (a: Dayjs, b: Dayjs): boolean => Math.abs(a.diff(b, 'day')) < 1;

const getBorderRadii = <T extends DayjsPeriod>(period: T, i: number, allPeriods: Array<T>): PeriodBorderRadius => {
    const left =
        i > 0 && withinADay(allPeriods[i - 1].fom, period.tom)
            ? {
                  borderBottomLeftRadius: 0,
                  borderTopLeftRadius: 0,
              }
            : undefined;

    const right =
        i < allPeriods.length - 1 && withinADay(period.fom, allPeriods[i + 1].tom)
            ? {
                  borderBottomRightRadius: 0,
                  borderTopRightRadius: 0,
              }
            : undefined;

    return {
        ...left,
        ...right,
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
    periods: Array<T>
): Map<number, PeriodStyling> =>
    useMemo(() => {
        const map = new Map<number, PeriodStyling>();
        const datePeriods = periods.map((period) => ({
            fom: dayjs(period.fom).startOf('day'),
            tom: dayjs(period.tom).endOf('day'),
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

import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';

import { DatePeriod } from '@typer/shared';

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
    isFirst?: boolean;
    hasLeftNeighbour?: boolean;
    hasRightNeighbour?: boolean;
};

const getBorderRadii = <T extends StyledPeriod>(period: T): PeriodBorderRadius => {
    const leftSideRadii = period.hasLeftNeighbour ? { borderBottomLeftRadius: 0, borderTopLeftRadius: 0 } : undefined;
    const rightSideRadii = period.hasRightNeighbour
        ? { borderBottomRightRadius: 0, borderTopRightRadius: 0 }
        : undefined;
    return { ...leftSideRadii, ...rightSideRadii };
};

export const getPosition = (date: Dayjs, start: Dayjs, end: Dayjs): number => {
    const diff = end.diff(start);
    const position = (date.diff(start) / diff) * 100;
    return position > 0 ? (position < 100 ? position : 100) : 0;
};

/**
 * Hei og gratulerer med å ha funnet frem til et av easter eggene i speil-koden.
 *
 * @param start venstre ende av utsnittet
 * @param end høyre ende av utsnittet
 * @param periods forventes å være sortert med nyeste (høyeste FOM) først
 */
export const usePeriodStyling = <T extends DatePeriod>(
    start: Dayjs,
    end: Dayjs,
    periods: Array<T>,
): Map<number, PeriodStyling> =>
    useMemo(() => {
        const map = new Map<number, PeriodStyling>();
        const datePeriods: Array<StyledPeriod> = periods.map((period) => {
            return {
                ...period,
                fom: dayjs(period.fom).startOf('day'),
                tom: dayjs(period.tom).endOf('day'),
            };
        });

        for (const [i, period] of datePeriods.entries()) {
            const right = getPosition(period.fom, start, end);
            const width = getPosition(period.tom, start, end) - right;
            const borderRadii = getBorderRadii(period);
            const høyreEndeAvPeriodenErSkjult = start > period.fom;

            if (right === 0 && høyreEndeAvPeriodenErSkjult) {
                borderRadii.borderTopRightRadius = 0;
                borderRadii.borderBottomRightRadius = 0;
            }

            if (right + width === 100 && !period.isFirst) {
                borderRadii.borderTopLeftRadius = 0;
                borderRadii.borderBottomLeftRadius = 0;
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

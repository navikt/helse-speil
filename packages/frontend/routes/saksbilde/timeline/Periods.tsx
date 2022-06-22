import React from 'react';
import dayjs from 'dayjs';

import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';
import { getNextDay, getPreviousDay } from '@utils/date';
import type { GhostPeriode, Periode } from '@io/graphql';
import { Periodetilstand } from '@io/graphql';
import { isNotReady } from '@state/periode';

import { Period } from './Period';
import { usePeriodStyling } from './usePeriodStyling';
import { useVisiblePeriods } from './useVisiblePeriods';

import styles from './Periods.module.css';

const byFomAscending = (a: DatePeriod, b: DatePeriod): number => new Date(b.fom).getTime() - new Date(a.fom).getTime();

const filterReadyPeriods = (periods: Array<Periode>): Array<Periode> =>
    periods.filter((it) => !(it.erForkastet && isNotReady(it)));

const filterValidPeriods = (periods: Array<DatePeriod>): Array<DatePeriod> =>
    periods.filter((it) => (isBeregnetPeriode(it) ? it.periodetilstand !== Periodetilstand.TilInfotrygd : true));

const isActive = (activePeriod: Periode, currentPeriod: Periode): boolean => {
    if (isGhostPeriode(activePeriod) && isGhostPeriode(currentPeriod)) {
        return activePeriod.id === currentPeriod.id;
    } else if (isBeregnetPeriode(activePeriod) && isBeregnetPeriode(currentPeriod)) {
        return activePeriod.id === currentPeriod.id;
    } else if (isUberegnetPeriode(activePeriod) && isUberegnetPeriode(currentPeriod)) {
        return activePeriod.id === currentPeriod.id;
    } else {
        return false;
    }
};

const containsDate = (period: DatePeriod, date: DateString): boolean => {
    return dayjs(period.fom).isSameOrBefore(date) && dayjs(period.tom).isSameOrAfter(date);
};

const containsPeriod = (container: DatePeriod, maybeContained: DatePeriod): boolean => {
    return (
        dayjs(container.fom).isSameOrBefore(maybeContained.fom) &&
        dayjs(container.tom).isSameOrAfter(maybeContained.tom)
    );
};

export const trimOverlappingPeriods = (
    periodsToCompare: Array<DatePeriod>,
    periodsToTrim: Array<DatePeriod>,
): Array<DatePeriod> => {
    const result: Array<DatePeriod> = [];

    trim: for (const toTrim of periodsToTrim) {
        const trimmed: DatePeriod = { ...toTrim };

        for (const period of periodsToCompare) {
            if (containsPeriod(trimmed, period)) {
                result.push(
                    ...trimOverlappingPeriods(periodsToCompare, [
                        {
                            ...trimmed,
                            fom: trimmed.fom,
                            tom: getPreviousDay(period.fom),
                        },
                    ]),
                );
                result.push(
                    ...trimOverlappingPeriods(periodsToCompare, [
                        {
                            ...trimmed,
                            fom: getNextDay(period.tom),
                            tom: trimmed.tom,
                        },
                    ]),
                );
                continue trim;
            }
            if (containsPeriod(period, trimmed)) {
                continue trim;
            }
            if (containsDate(trimmed, period.fom)) {
                trimmed.tom = getPreviousDay(period.fom);
            }
            if (containsDate(trimmed, period.tom)) {
                trimmed.fom = getNextDay(period.tom);
            }
        }

        result.push(trimmed);
    }

    return result;
};

const mergePeriods = (
    fromSpleis: Array<Periode>,
    fromInfotrygd: Array<InfotrygdPeriod>,
    ghostPeriods: Array<GhostPeriode>,
): Array<TimelinePeriod> => {
    const periodsFromSpleis = filterReadyPeriods(fromSpleis);
    const periodsFromInfotrygd = trimOverlappingPeriods(periodsFromSpleis, fromInfotrygd);
    return [...periodsFromSpleis, ...periodsFromInfotrygd, ...ghostPeriods].sort(byFomAscending);
};

const markFirstPeriod = (periods: Array<TimelinePeriod>) => {
    if (periods[0]) {
        periods[0] = {
            ...periods[0],
            isFirst: true,
        };
    }
};

interface PeriodsProps {
    start: Dayjs;
    end: Dayjs;
    periods: Array<Periode>;
    activePeriod?: Maybe<TimelinePeriod>;
    infotrygdPeriods?: Array<InfotrygdPeriod>;
    ghostPeriods?: Array<GhostPeriode>;
    notCurrent?: boolean;
}

export const Periods: React.VFC<PeriodsProps> = ({
    start,
    end,
    periods,
    infotrygdPeriods = [],
    ghostPeriods = [],
    notCurrent,
    activePeriod,
}) => {
    const allPeriods = mergePeriods(periods, infotrygdPeriods, ghostPeriods);

    markFirstPeriod(allPeriods);

    const visiblePeriods = useVisiblePeriods(end, start, allPeriods);
    const validPeriods = filterValidPeriods(visiblePeriods);
    const positions = usePeriodStyling(start, end, validPeriods);

    return (
        <div className={styles.Periods}>
            {validPeriods.map((period, i) => (
                <Period
                    key={i}
                    period={period}
                    style={positions.get(i) ?? {}}
                    notCurrent={notCurrent}
                    isActive={isActive(activePeriod as Periode, period as Periode)}
                />
            ))}
        </div>
    );
};

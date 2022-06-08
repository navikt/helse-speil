import React from 'react';

import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';
import type { GhostPeriode, Periode } from '@io/graphql';
import { Periodetilstand } from '@io/graphql';

import { Period, periodIsVenting } from './Period';
import { usePeriodStyling } from './usePeriodStyling';
import { useVisiblePeriods } from './useVisiblePeriods';

import styles from './Periods.module.css';

const byFomAscending = (a: DatePeriod, b: DatePeriod) => new Date(b.fom).getTime() - new Date(a.fom).getTime();

const filterActivePeriods = (periods: Array<Periode>): Array<Periode> =>
    periods.filter((it) => !(it.erForkastet && periodIsVenting(it)));

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
    infotrygdPeriods,
    ghostPeriods,
    notCurrent,
    activePeriod,
}) => {
    const allPeriods = [...filterActivePeriods(periods), ...(infotrygdPeriods ?? []), ...(ghostPeriods ?? [])].sort(
        byFomAscending,
    );
    const visiblePeriods = filterValidPeriods(useVisiblePeriods(start, allPeriods));
    const positions = usePeriodStyling(start, end, visiblePeriods);

    return (
        <div className={styles.Periods}>
            {visiblePeriods.map((period, i) => (
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

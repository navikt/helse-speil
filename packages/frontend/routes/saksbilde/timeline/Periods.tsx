import React from 'react';

import { GhostPeriode, Periode, Periodetilstand } from '@io/graphql';
import { isNotReady } from '@state/selectors/period';
import {
    isBeregnetPeriode,
    isGhostPeriode,
    isUberegnetPeriode,
    isUberegnetVilkarsprovdPeriode,
} from '@utils/typeguards';

import { Period } from './Period';
import { usePeriodStyling } from './hooks/usePeriodStyling';
import { usePopulateNeighbours } from './hooks/usePopulateNeighbours';
import { useVisiblePeriods } from './hooks/useVisiblePeriods';

import styles from './Periods.module.css';

const byFomAscending = (a: DatePeriod, b: DatePeriod): number => new Date(b.fom).getTime() - new Date(a.fom).getTime();

const filterReadyPeriods = (periods: Array<Periode>): Array<Periode> =>
    periods.filter((it) => !(it.erForkastet && isNotReady(it)));

const filterValidPeriods = (periods: Array<DatePeriod>): Array<DatePeriod> =>
    periods.filter((it) =>
        isBeregnetPeriode(it)
            ? it.periodetilstand !== Periodetilstand.TilInfotrygd
            : isGhostPeriode(it)
              ? !it.deaktivert
              : true,
    );

const isActive = (activePeriod: Periode, currentPeriod: Periode): boolean => {
    if (isGhostPeriode(activePeriod) && isGhostPeriode(currentPeriod)) {
        return activePeriod.id === currentPeriod.id;
    } else if (isBeregnetPeriode(activePeriod) && isBeregnetPeriode(currentPeriod)) {
        return activePeriod.id === currentPeriod.id;
    } else if (isUberegnetPeriode(activePeriod) && isUberegnetPeriode(currentPeriod)) {
        return activePeriod.id === currentPeriod.id;
    } else if (isUberegnetVilkarsprovdPeriode(activePeriod) && isUberegnetVilkarsprovdPeriode(currentPeriod)) {
        return activePeriod.id === currentPeriod.id;
    } else {
        return false;
    }
};

const mergePeriods = (
    fromSpleis: Array<Periode>,
    fromInfotrygd: Array<InfotrygdPeriod>,
    ghostPeriods: Array<GhostPeriode>,
): Array<TimelinePeriod> => {
    const periodsFromSpleis = filterReadyPeriods(fromSpleis);
    return [...periodsFromSpleis, ...fromInfotrygd, ...ghostPeriods].sort(byFomAscending);
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

export const Periods: React.FC<PeriodsProps> = ({
    start,
    end,
    periods,
    infotrygdPeriods = [],
    ghostPeriods = [],
    notCurrent,
    activePeriod,
}) => {
    const allPeriods = mergePeriods(periods, infotrygdPeriods, ghostPeriods);
    const validPeriods = filterValidPeriods(allPeriods);
    const populatedPeriods = usePopulateNeighbours(validPeriods);
    const visiblePeriods = useVisiblePeriods(end, start, populatedPeriods);
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

import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { TimelinePeriod } from '@/routes/saksbilde/timeline/timeline-types';
import { DatePeriod, InfotrygdPeriod } from '@/types/shared';
import { GhostPeriodeFragment, PeriodeFragment, Periodetilstand } from '@io/graphql';
import { isNotReady } from '@state/selectors/period';
import { Maybe } from '@utils/ts';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

import { Period } from './Period';
import { usePeriodStyling } from './hooks/usePeriodStyling';
import { usePopulateNeighbours } from './hooks/usePopulateNeighbours';
import { useVisiblePeriods } from './hooks/useVisiblePeriods';

import styles from './Periods.module.css';

const byFomAscending = (a: DatePeriod, b: DatePeriod): number => new Date(b.fom).getTime() - new Date(a.fom).getTime();

const filterReadyPeriods = (periods: Array<PeriodeFragment>): Array<PeriodeFragment> =>
    periods.filter((it) => !(it.erForkastet && isNotReady(it)));

const filterValidPeriods = (periods: Array<DatePeriod>): Array<DatePeriod> =>
    periods.filter((it) =>
        isBeregnetPeriode(it)
            ? it.periodetilstand !== Periodetilstand.TilInfotrygd
            : isGhostPeriode(it)
              ? !it.deaktivert
              : true,
    );

const isActive = (activePeriod: Maybe<TimelinePeriod>, currentPeriod: Maybe<TimelinePeriod>): boolean => {
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

const mergePeriods = (
    fromSpleis: Array<PeriodeFragment>,
    fromInfotrygd: Array<InfotrygdPeriod>,
    ghostPeriods: Array<GhostPeriodeFragment>,
): Array<TimelinePeriod> => {
    const periodsFromSpleis = filterReadyPeriods(fromSpleis);
    return [...periodsFromSpleis, ...fromInfotrygd, ...ghostPeriods].sort(byFomAscending);
};

interface PeriodsProps {
    start: Dayjs;
    end: Dayjs;
    periods: Array<PeriodeFragment>;
    activePeriod: Maybe<TimelinePeriod>;
    infotrygdPeriods?: Array<InfotrygdPeriod>;
    ghostPeriods?: Array<GhostPeriodeFragment>;
    notCurrent?: boolean;
}

export const Periods = ({
    start,
    end,
    periods,
    infotrygdPeriods = [],
    ghostPeriods = [],
    notCurrent,
    activePeriod,
}: PeriodsProps): ReactElement => {
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
                    isActive={isActive(activePeriod, period)}
                />
            ))}
        </div>
    );
};

import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import {
    GhostPeriodeFragment,
    Maybe,
    NyttInntektsforholdPeriodeFragment,
    PeriodeFragment,
    Periodetilstand,
} from '@io/graphql';
import { isNotReady } from '@state/selectors/period';
import { DatePeriod, InfotrygdPeriod } from '@typer/shared';
import { TimelinePeriod } from '@typer/timeline';
import {
    isBeregnetPeriode,
    isGhostPeriode,
    isInfotrygdPeriod,
    isTilkommenInntekt,
    isUberegnetPeriode,
} from '@utils/typeguards';

import { Period } from './Period';
import { usePeriodStyling } from './hooks/usePeriodStyling';
import { usePopulateNeighbours } from './hooks/usePopulateNeighbours';
import { useVisiblePeriods } from './hooks/useVisiblePeriods';

import styles from './Periods.module.css';

const byFomAscending = (a: DatePeriod, b: DatePeriod): number => new Date(b.fom).getTime() - new Date(a.fom).getTime();

const filterReadyPeriods = (periods: Array<PeriodeFragment>): Array<PeriodeFragment> =>
    periods.filter((it) => !(it.erForkastet && isNotReady(it)));

const filterValidPeriods = (periods: Array<DatePeriod>): Array<DatePeriod> =>
    periods.filter(
        (it) =>
            (isBeregnetPeriode(it) && it.periodetilstand !== Periodetilstand.TilInfotrygd) ||
            isUberegnetPeriode(it) ||
            isInfotrygdPeriod(it) ||
            (isGhostPeriode(it) && !it.deaktivert) ||
            isTilkommenInntekt(it),
    );

const isActive = (activePeriod: Maybe<TimelinePeriod>, currentPeriod: Maybe<TimelinePeriod>): boolean => {
    if (isGhostPeriode(activePeriod) && isGhostPeriode(currentPeriod)) {
        return activePeriod.id === currentPeriod.id;
    } else if (isBeregnetPeriode(activePeriod) && isBeregnetPeriode(currentPeriod)) {
        return activePeriod.id === currentPeriod.id;
    } else if (isUberegnetPeriode(activePeriod) && isUberegnetPeriode(currentPeriod)) {
        return activePeriod.id === currentPeriod.id;
    } else if (isTilkommenInntekt(activePeriod) && isTilkommenInntekt(currentPeriod)) {
        return activePeriod.id === currentPeriod.id;
    } else {
        return false;
    }
};

const mergePeriods = (
    fromSpleis: Array<PeriodeFragment>,
    fromInfotrygd: Array<InfotrygdPeriod>,
    ghostPeriods: Array<GhostPeriodeFragment>,
    nyeInntektsforholdPeriods: Array<NyttInntektsforholdPeriodeFragment>,
): Array<TimelinePeriod> => {
    const periodsFromSpleis = filterReadyPeriods(fromSpleis);
    return [...periodsFromSpleis, ...fromInfotrygd, ...ghostPeriods, ...nyeInntektsforholdPeriods].sort(byFomAscending);
};

interface PeriodsProps {
    start: Dayjs;
    end: Dayjs;
    periods: Array<PeriodeFragment>;
    activePeriod: Maybe<TimelinePeriod>;
    infotrygdPeriods?: Array<InfotrygdPeriod>;
    ghostPeriods?: Array<GhostPeriodeFragment>;
    nyeInntektsforholdPeriods?: Array<NyttInntektsforholdPeriodeFragment>;
    notCurrent?: boolean;
}

export const Periods = ({
    start,
    end,
    periods,
    infotrygdPeriods = [],
    ghostPeriods = [],
    nyeInntektsforholdPeriods = [],
    notCurrent,
    activePeriod,
}: PeriodsProps): ReactElement => {
    const allPeriods = mergePeriods(periods, infotrygdPeriods, ghostPeriods, nyeInntektsforholdPeriods);
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
